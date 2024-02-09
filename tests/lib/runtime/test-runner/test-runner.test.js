import { jutest } from "jutest";
import { SpecsContainer, Jutest } from "core";
import { TestRunner } from "runtime";
import { spy } from "sinon";

jutest("TestRunner", s => {
  s.setup(() => {
    let container = new SpecsContainer();
    let runner = new TestRunner({ specsContainer: container });
    let jutest = new Jutest({ specsContainer: container }).toPublicAPI();

    async function runAll() {
      await container.composeAll();
      await runner.runAll();
    }

    return { container, runner, jutest, runAll };
  });

  s.describe("#runAll()", s => {
    s.test("runs tests from the container", async (t, { jutest, container, runAll }) => {
      jutest.test('test', t => {
        t.assert(true);
      });

      await runAll();
      let [test] = container.specs;

      t.equal(test.wasRun, true);
      t.equal(test.result.passed, true);
    });

    s.test("runs suites from the container", async (t, { jutest, container, runAll }) => {
      jutest.describe('suite', s => {
        s.test('test', t => {
          t.assert(true);
        });
      });

      await runAll();
      let [test] = container.specs[0].specs;

      t.equal(test.wasRun, true);
      t.equal(test.result.passed, true);
    });

    ['run-start', 'run-end'].forEach(event => {
      s.test(`emits "${event}" event`, async (t, { runner, runAll }) => {
        let listener = spy();
        runner.on(event, listener);
        await runAll();

        t.equal(listener.called, true);
      });
    });

    ['suite-start', 'suite-end'].forEach(event => {
      s.test(`emits "${event}" event`, async (t, { runner, jutest, runAll }) => {
        jutest.describe('my-suite', () => {});
        let listener = spy();
        runner.on(event, listener);

        await runAll();

        t.equal(listener.called, true);
        let suite = listener.firstCall.args[0];
        t.equal(suite.name, 'my-suite');
      });
    });

    ['test-start', 'test-end'].forEach(event => {
      s.test(`emits "${event}" event`, async (t, { runner, jutest, runAll }) => {
        jutest.describe('my-suite', s => {
          s.test('my-test', () => {});
        });

        let listener = spy();
        runner.on(event, listener);

        await runAll();

        t.equal(listener.called, true);
        let test = listener.firstCall.args[0];
        t.equal(test.name, 'my-suite my-test');
      });
    });
  });

  s.describe("#runAtFileLocation", s => {
    let ownFileName = 'test-runner.test.js';

    s.setup(({ container, runner }) => {
      async function runAtFileLocation(...args) {
        await container.composeAll();
        await runner.runAtFileLocation(...args);
      }

      return { runAtFileLocation };
    });

    s.test("only runs test/suite defined on the specified line", async (t, { jutest, container, runAtFileLocation }) => {
      jutest.test('test', () => {});
      jutest.test('test2', () => {});
      await runAtFileLocation({ fileName: ownFileName, lineNumber: 102 });

      let [test1, test2] = container.specs;

      t.equal(test1.wasRun, true);
      t.equal(test2.wasRun, false);
    });

    s.test("works with nested specs", async (t, { jutest, container, runAtFileLocation }) => {
      jutest.describe('suite', (s) => {
        s.test('test1', () => {});
        s.test('test2', () => {});
      });

      await runAtFileLocation({ fileName: ownFileName, lineNumber: 94 });

      let [test1, test2] = container.specs[0].specs;

      t.equal(test1.wasRun, true);
      t.equal(test2.wasRun, false);
    });

    s.test("runs all defined specs if nothing can be found on the specified line", async (t, { jutest, container, runAtFileLocation }) => {
      jutest.describe('suite', (s) => {
        s.test('test1', () => {});
        s.test('test2', () => {});
      });

      await runAtFileLocation({ fileName: ownFileName, lineNumber: 0 });

      let [test1, test2] = container.specs[0].specs;

      t.equal(test1.wasRun, true);
      t.equal(test2.wasRun, true);
    });
  });
});
