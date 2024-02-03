import { jutest } from "jutest";
import { TestsContainer, Jutest } from "core";
import { TestRunner } from "runtime";
import { spy } from "sinon";

jutest("TestRunner", s => {
  s.setup(() => {
    let container = new TestsContainer();
    let runner = new TestRunner({ testsContainer: container });
    let jutest = new Jutest({ testsContainer: container }).toPublicAPI();

    return { container, runner, jutest };
  });

  s.describe("#run", s => {
    s.test("runs tests from the container", async (t, { runner, jutest, container }) => {
      jutest.test('test', t => {
        t.assert(true);
      });

      await runner.run();
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

      await runner.run();
      let [suite] = container.testsAndSuites;
      let [test] = suite.testsAndSuites;

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

      await t.async.rejects(runner.run(), /foobar/);
      t.equal(testBody.called, false);
    });

    ['run-start', 'suites-loaded'].forEach(event => {
      s.test(`emits "${event}" event`, async (t, { runner }) => {
        let listener = spy();
        runner.on(event, listener);
        await runner.run();

        t.equal(listener.called, true);
      });
    });

    ['suite-start', 'suite-end'].forEach(event => {
      s.test(`emits "${event}" event`, async (t, { runner, jutest }) => {
        jutest.describe('my-suite', () => {});
        let listener = spy();
        runner.on(event, listener);

        await runner.run();

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

        await runner.run();

        t.equal(listener.called, true);
        let test = listener.firstCall.args[0];
        t.equal(test.name, 'my-suite my-test');
      });
    });

    s.test("emits run-end event", async (t, { runner, jutest }) => {
      jutest.describe('my-suite', () => {});
      let listener = spy();
      runner.on('run-end', listener);

      await runner.run();

      t.equal(listener.called, true);
    });
  });
});
