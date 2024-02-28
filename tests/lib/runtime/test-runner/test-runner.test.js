import { jutest } from "jutest";
import { SpecsContainer, Jutest, TestExecutionStatuses } from "core";
import { TestRunner } from "runtime";
import { RunEvents, SpecTypes, ExitReasons } from "runtime/test-runner/enums";
import { spy } from "sinon";

jutest("TestRunner", s => {
  s.setup(() => {
    let container = new SpecsContainer();
    let runner = new TestRunner({ specsContainer: container });
    let jutest = new Jutest({ specsContainer: container }).toPublicAPI();

    return { container, runner, jutest };
  });

  s.describe("#runAll()", s => {
    s.test("runs tests from the container", async (t, { jutest, container, runner }) => {
      jutest.test('test', t => {
        t.assert(true);
      });

      await runner.runAll();
      let [test] = container.specs;

      t.equal(test.wasRun, true);
      t.equal(test.result.status, TestExecutionStatuses.Passed);
    });

    s.test("runs suites from the container", async (t, { jutest, container, runner }) => {
      jutest.describe('suite', s => {
        s.test('test', t => {
          t.assert(true);
        });
      });

      await runner.runAll();
      let [test] = await container.specs[0].composeSpecs();

      t.equal(test.wasRun, true);
      t.equal(test.result.status, TestExecutionStatuses.Passed);
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
      t.equal(runSummary.exitReason, ExitReasons.RunEnd);
    });
  });

  s.describe("events", s => {
    s.test('emits run-start event', async (t, { runner }) => {
      let listener = spy();
      runner.on(RunEvents.RunStart, listener);
      await runner.runAll();

      t.equal(listener.called, true);
    });

    s.test('emits run-end event', async (t, { runner }) => {
      let listener = spy();
      runner.on(RunEvents.RunEnd, listener);
      await runner.runAll();

      t.equal(listener.called, true);
      let runSummary = listener.firstCall.args[0];
      t.assert(runSummary.exitReason);
    });

    [RunEvents.SuiteStart, RunEvents.SuiteEnd].forEach(event => {
      s.test(`emits "${event}" event`, async (t, { jutest, runner }) => {
        jutest.describe('my-suite', () => {});
        let listener = spy();
        runner.on(event, listener);

        await runner.runAll();

        t.equal(listener.called, true);
        let suiteSummary = listener.firstCall.args[0];
        t.equal(suiteSummary.name, 'my-suite');
        t.equal(suiteSummary.type, SpecTypes.Suite);
      });
    });

    [RunEvents.TestStart, RunEvents.TestEnd].forEach(event => {
      s.test(`emits "${event}" event`, async (t, { jutest, runner }) => {
        jutest.describe('my-suite', s => {
          s.test('my-test', () => {});
        });
        let listener = spy();
        runner.on(event, listener);

        await runner.runAll();

        t.equal(listener.called, true);
        let testSummary = listener.firstCall.args[0];
        t.equal(testSummary.name, 'my-suite my-test');
        t.equal(testSummary.type, SpecTypes.Test);
      });
    });

    s.test("test-end event includes test results", async (t, { jutest, runner }) => {
      jutest.test('my-test', () => {});
      let listener = spy();
      runner.on(RunEvents.TestEnd, listener);

      await runner.runAll();

      let testSummary = listener.firstCall.args[0];
      t.assert(testSummary.executionResult);
    });

    s.test('emits test-skip event', async (t, { runner, jutest }) => {
      jutest.xtest('my-test', () => {});

      let listener = spy();
      runner.on(RunEvents.TestSkip, listener);
      await runner.runAll();

      t.equal(listener.called, true);
      let testSummary = listener.firstCall.args[0];
      t.assert(testSummary.executionResult.status);
    });
  });

  s.describe("#runAtFileLocation", s => {
    let ownFileName = 'test-runner.test.js';

    s.test("only runs test/suite defined on the specified line", async (t, { jutest, container, runner }) => {
      jutest.test('test', () => {});
      jutest.test('test2', () => {});
      await runner.runAtFileLocation({ fileName: ownFileName, lineNumber: 139 });

      let [test1, test2] = container.specs;

      t.equal(test1.wasRun, true);
      t.equal(test2.wasRun, false);
    });

    s.test("works with nested specs", async (t, { jutest, container, runner }) => {
      jutest.describe('suite', (s) => {
        s.describe('suite1', s => {
          s.test('test1', () => {});
        });
        s.describe('suite2', s => {
          s.test('test2', () => {});
        });
      });

      await runner.runAtFileLocation({ fileName: ownFileName, lineNumber: 155 });

      let [suite1, suite2] = await container.specs[0].composeSpecs();
      let [test1] = await suite1.composeSpecs();
      let [test2] = await suite2.composeSpecs();

      t.equal(test1.wasRun, false);
      t.equal(test2.wasRun, true);
    });

    s.test("runs all defined specs if nothing can be found on the specified line", async (t, { jutest, container, runner }) => {
      jutest.describe('suite', (s) => {
        s.test('test1', () => {});
        s.test('test2', () => {});
      });

      await runner.runAtFileLocation({ fileName: ownFileName, lineNumber: 0 });

      let [test1, test2] = await container.specs[0].composeSpecs();

      t.equal(test1.wasRun, true);
      t.equal(test2.wasRun, true);
    });
  });
});
