import { jutest } from "jutest";
import { SpecsContainer, Jutest } from "core";
import { TestRunner } from "runtime";
import { RunEvents } from "runtime/test-runner/enums";
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
      t.equal(test.result.passed, true);
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
      t.equal(test.result.passed, true);
    });

    [RunEvents.RunStart, RunEvents.RunEnd].forEach(event => {
      s.test(`emits "${event}" event`, async (t, { runner }) => {
        let listener = spy();
        runner.on(event, listener);
        await runner.runAll();

        t.equal(listener.called, true);
      });
    });

    [RunEvents.SuiteStart, RunEvents.SuiteEnd].forEach(event => {
      s.test(`emits "${event}" event`, async (t, { jutest, runner }) => {
        jutest.describe('my-suite', () => {});
        let listener = spy();
        runner.on(event, listener);

        await runner.runAll();

        t.equal(listener.called, true);
        let suite = listener.firstCall.args[0];
        t.equal(suite.name, 'my-suite');
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
        let test = listener.firstCall.args[0];
        t.equal(test.name, 'my-suite my-test');
      });
    });
  });

  s.describe("#runAtFileLocation", s => {
    let ownFileName = 'test-runner.test.js';

    s.test("only runs test/suite defined on the specified line", async (t, { jutest, container, runner }) => {
      jutest.test('test', () => {});
      jutest.test('test2', () => {});
      await runner.runAtFileLocation({ fileName: ownFileName, lineNumber: 89 });

      let [test1, test2] = container.specs;

      t.equal(test1.wasRun, true);
      t.equal(test2.wasRun, false);
    });

    s.test("works with nested specs", async (t, { jutest, container, runner }) => {
      jutest.describe('suite', (s) => {
        s.test('test1', () => {});
        s.test('test2', () => {});
      });

      await runner.runAtFileLocation({ fileName: ownFileName, lineNumber: 101 });

      let [test1, test2] = await container.specs[0].composeSpecs();

      t.equal(test1.wasRun, true);
      t.equal(test2.wasRun, false);
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
