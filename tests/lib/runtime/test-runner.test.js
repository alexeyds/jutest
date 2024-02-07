import { jutest } from "jutest";
import { SpecsContainer, Jutest } from "core";
import { TestRunner } from "runtime";
import { spy } from "sinon";

jutest("TestRunner", s => {
  s.setup(() => {
    let container = new SpecsContainer();
    let runner = new TestRunner({ specsContainer: container });
    let jutest = new Jutest({ specsContainer: container }).toPublicAPI();

    return { container, runner, jutest };
  });

  s.describe("#runAll()", s => {
    s.test("runs tests from the container", async (t, { runner, jutest, container }) => {
      jutest.test('test', t => {
        t.assert(true);
      });

      await runner.runAll();
      let [test] = container.testsAndSuites;

      t.equal(test.wasRun, true);
      t.equal(test.result.passed, true);
    });

    s.test("runs suites from the container", async (t, { runner, jutest, container }) => {
      jutest.describe('suite', s => {
        s.test('test', t => {
          t.assert(true);
        });
      });

      await runner.runAll();
      let [test] = container.testsAndSuites[0].testsAndSuites;

      t.equal(test.wasRun, true);
      t.equal(test.result.passed, true);
    });

    s.test("composes all suites prior to running them", async (t, { runner, jutest }) => {
      let testBody = spy();

      jutest.describe('suite1', s => {
        s.test('test', testBody);
      });

      jutest.describe('suite2', () => {
        throw 'foobar';
      });

      await t.async.rejects(runner.runAll(), /foobar/);
      t.equal(testBody.called, false);
    });

    ['run-start', 'suites-loaded'].forEach(event => {
      s.test(`emits "${event}" event`, async (t, { runner }) => {
        let listener = spy();
        runner.on(event, listener);
        await runner.runAll();

        t.equal(listener.called, true);
      });
    });

    ['suite-start', 'suite-end'].forEach(event => {
      s.test(`emits "${event}" event`, async (t, { runner, jutest }) => {
        jutest.describe('my-suite', () => {});
        let listener = spy();
        runner.on(event, listener);

        await runner.runAll();

        t.equal(listener.called, true);
        let suite = listener.firstCall.args[0];
        t.equal(suite.name, 'my-suite');
      });
    });

    ['test-start', 'test-end'].forEach(event => {
      s.test(`emits "${event}" event`, async (t, { runner, jutest }) => {
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

    s.test("emits run-end event", async (t, { runner, jutest }) => {
      jutest.describe('my-suite', () => {});
      let listener = spy();
      runner.on('run-end', listener);

      await runner.runAll();

      t.equal(listener.called, true);
    });
  });

  s.describe("#runAtFileLocation", s => {
    let ownFileName = 'test-runner.test.js'

    s.test("only runs test/suite defined on the specified line", async (t, { runner, jutest, container }) => {
      jutest.test('test', () => {});
      jutest.test('test2', () => {});
      await runner.runAtFileLocation({ fileName: ownFileName, lineNumber: 113 })

      let [test1, test2] = container.testsAndSuites;

      t.equal(test1.wasRun, true);
      t.equal(test2.wasRun, false);
    });

    s.test("works with nested specs", async (t, { runner, jutest, container }) => {
      jutest.describe('suite', (s) => {
        s.test('test1', () => {});
        s.test('test2', () => {});
      });

      await runner.runAtFileLocation({ fileName: ownFileName, lineNumber: 125 })

      let [test1, test2] = container.testsAndSuites[0].testsAndSuites;

      t.equal(test1.wasRun, true);
      t.equal(test2.wasRun, false);
    });

    s.test("runs all defined specs if nothing can be found on the specified line", async (t, { runner, jutest, container }) => {
      jutest.describe('suite', (s) => {
        s.test('test1', () => {});
        s.test('test2', () => {});
      });

      await runner.runAtFileLocation({ fileName: ownFileName, lineNumber: 0 })

      let [test1, test2] = container.testsAndSuites[0].testsAndSuites;

      t.equal(test1.wasRun, true);
      t.equal(test2.wasRun, true);
    });
  });
});
