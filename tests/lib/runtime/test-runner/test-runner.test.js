import { jutest } from "jutest";
import { SpecTypes, RuntimeEvents } from "runtime/enums";
import { Test } from "core";
import { TestRunner, RuntimeContext, Jutest } from "runtime";
import { spy } from "sinon";

jutest("TestRunner", s => {
  s.setup(() => {
    let context = new RuntimeContext();
    let runner = new TestRunner(context);
    let jutest = new Jutest({ specsContainer: context.specsContainer }).toPublicAPI();

    return { context, runner, jutest, };
  });

  s.describe("#runAll()", s => {
    s.test("runs tests from the container", async (t, { jutest, context, runner }) => {
      jutest.test('test', t => {
        t.assert(true);
      });

      await runner.runAll();
      let [test] = context.specsContainer.specs;

      t.equal(test.wasRun, true);
      t.equal(test.result.status, Test.ExecutionStatuses.Passed);
    });

    s.test("runs suites from the container", async (t, { jutest, context, runner }) => {
      jutest.describe('suite', s => {
        s.test('test', t => {
          t.assert(true);
        });
      });

      await runner.runAll();
      let [test] = await context.specsContainer.specs[0].composeSpecs();

      t.equal(test.wasRun, true);
      t.equal(test.result.status, Test.ExecutionStatuses.Passed);
    });

    s.test("returns summary", async (t, { runner }) => {
      let runSummary = await runner.runAll();
      t.assert(runSummary.exitReason);
    });

    s.test("returns summary", async (t, { runner, jutest }) => {
      jutest.test('my-test', () => {});
      let runSummary = await runner.runAll();

      t.equal(runSummary.passedTestsCount, 1);
      t.equal(runSummary.testSummaries.length, 1);
      t.assert(runSummary.runStartedAt);
      t.assert(runSummary.runEndedAt);
      t.equal(runSummary.exitReason, TestRunner.ExitReasons.RunEnd);
    });
  });

  s.describe("events", s => {
    s.test('emits run-start event', async (t, { runner, context }) => {
      let listener = spy();
      context.runtimeEventEmitter.on(RuntimeEvents.RunStart, listener);
      await runner.runAll();

      t.equal(listener.called, true);
    });

    s.test('emits run-end event', async (t, { runner, context }) => {
      let listener = spy();
      context.runtimeEventEmitter.on(RuntimeEvents.RunEnd, listener);
      await runner.runAll();

      t.equal(listener.called, true);
      let runSummary = listener.firstCall.args[0];
      t.assert(runSummary.exitReason);
    });

    [RuntimeEvents.SuiteStart, RuntimeEvents.SuiteEnd].forEach(event => {
      s.test(`emits "${event}" event`, async (t, { jutest, runner, context }) => {
        jutest.describe('my-suite', () => {});
        let listener = spy();
        context.runtimeEventEmitter.on(event, listener);

        await runner.runAll();

        t.equal(listener.called, true);
        let suiteSummary = listener.firstCall.args[0];
        t.equal(suiteSummary.name, 'my-suite');
        t.equal(suiteSummary.type, SpecTypes.Suite);
      });
    });

    [RuntimeEvents.TestStart, RuntimeEvents.TestEnd].forEach(event => {
      s.test(`emits "${event}" event`, async (t, { jutest, runner, context }) => {
        jutest.describe('my-suite', s => {
          s.test('my-test', () => {});
        });
        let listener = spy();
        context.runtimeEventEmitter.on(event, listener);

        await runner.runAll();

        t.equal(listener.called, true);
        let testSummary = listener.firstCall.args[0];
        t.equal(testSummary.name, 'my-suite my-test');
        t.equal(testSummary.type, SpecTypes.Test);
      });
    });

    s.test("test-end event includes test results", async (t, { jutest, runner, context }) => {
      jutest.test('my-test', () => {});
      let listener = spy();
      context.runtimeEventEmitter.on(RuntimeEvents.TestEnd, listener);

      await runner.runAll();

      let testSummary = listener.firstCall.args[0];
      t.assert(testSummary.executionResult);
    });

    s.test('emits test-skip event', async (t, { runner, jutest, context }) => {
      jutest.xtest('my-test', () => {});

      let listener = spy();
      context.runtimeEventEmitter.on(RuntimeEvents.TestSkip, listener);
      await runner.runAll();

      t.equal(listener.called, true);
      let testSummary = listener.firstCall.args[0];
      t.assert(testSummary.executionResult.status);
    });
  });

  s.describe("#runAtFileLocation", s => {
    let ownFileName = 'test-runner.test.js';

    s.test("only runs test/suite defined on the specified line", async (t, { jutest, context, runner }) => {
      jutest.test('test', () => {});
      jutest.test('test2', () => {});
      await runner.runAtFileLocation({ fileName: ownFileName, lineNumber: 139 });

      let [test1, test2] = context.specsContainer.specs;

      t.equal(test1.wasRun, true);
      t.equal(test2.wasRun, false);
    });

    s.test("works with nested specs", async (t, { jutest, context, runner }) => {
      jutest.describe('suite', (s) => {
        s.describe('suite1', s => {
          s.test('test1', () => {});
        });
        s.describe('suite2', s => {
          s.test('test2', () => {});
          s.test('test3', () => {});
        });
      });

      await runner.runAtFileLocation({ fileName: ownFileName, lineNumber: 155 });

      let [suite1, suite2] = await context.specsContainer.specs[0].composeSpecs();
      let [test1] = await suite1.composeSpecs();
      let [test2, test3] = await suite2.composeSpecs();

      t.equal(test1.wasRun, false);
      t.equal(test2.wasRun, true);
      t.equal(test3.wasRun, false);
    });

    s.test("runs all defined specs if nothing can be found on the specified line", async (t, { jutest, context, runner }) => {
      jutest.describe('suite', (s) => {
        s.test('test1', () => {});
        s.test('test2', () => {});
      });

      await runner.runAtFileLocation({ fileName: ownFileName, lineNumber: 0 });

      let [test1, test2] = await context.specsContainer.specs[0].composeSpecs();

      t.equal(test1.wasRun, true);
      t.equal(test2.wasRun, true);
    });
  });
});
