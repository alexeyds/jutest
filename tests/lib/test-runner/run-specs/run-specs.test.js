import { jutest } from "jutest";
import { Jutest } from "core";
import { spy } from "sinon";
import { TestRunnerEnums } from "test-runner";
import { TestRunnerContext } from "test-runner/context";
import { runSpecs } from "test-runner/run-specs";

const { Events } = TestRunnerEnums;

function runSpecsFromContainer(specsContainer, context=new TestRunnerContext()) {
  return runSpecs(specsContainer.specsByFile, context);
}

function createListener(event, context) {
  let listener = spy();
  context.eventEmitter.on(event, listener);
  return listener;
}

jutest("runSpecs", s => {
  s.setup(() => {
    let { specsContainer } = new Jutest();
    let context = new TestRunnerContext();

    return { specsContainer, context };
  });

  s.test("runs provided tests", async (t, { specsContainer }) => {
    let test = specsContainer.test('test', () => {});
    await runSpecsFromContainer(specsContainer);

    t.equal(test.wasRun, true);
    t.assert(test.result.status);
  });

  s.test("runs provided suites", async (t, { specsContainer }) => {
    let suite = specsContainer.describe('suite', s => {
      s.test('foo', () => {});
    });
    await runSpecsFromContainer(specsContainer);
    let [test] = await suite.composeSpecs();

    t.equal(test.wasRun, true);
  });

  s.test("adds test results to summary", async (t, { specsContainer, context }) => {
    specsContainer.test('my test', () => {});
    await runSpecsFromContainer(specsContainer, context);
    let { runSummary } = context;

    t.equal(runSummary.testSummaries.length, 1);
    let testSummary = runSummary.testSummaries[0];
    t.equal(testSummary.name, 'my test');
    t.assert(testSummary.executionResult);
  });

  s.test("supports skipped tests", async (t, { specsContainer, context }) => {
    let test = specsContainer.xtest('test', () => {});
    await runSpecsFromContainer(specsContainer, context);

    t.equal(test.wasRun, false);
    t.equal(context.runSummary.testSummaries[0].name, 'test');
  });

  s.test("randomizes test order", async (t, { specsContainer }) => {
    specsContainer.test('test 1', () => {});
    specsContainer.test('test 2', () => {});
    specsContainer.test('test 3', () => {});
    let context = new TestRunnerContext({ seed: 12345, randomizeOrder: true });
    await runSpecsFromContainer(specsContainer, context);
    let { testSummaries } = context.runSummary;

    t.equal(testSummaries[0].name, 'test 2');
    t.equal(testSummaries[1].name, 'test 3');
  });

  [Events.FileStart, Events.FileEnd].forEach(event => {
    s.test(`emits ${event} event`, async (t, { specsContainer, context }) => {
      let listener = createListener(event, context);

      await specsContainer.withSourceFilePath('foo.test', () => {
        specsContainer.test('my test', () => {});
      });
      await runSpecsFromContainer(specsContainer, context);

      t.same(listener.firstCall.args, ['foo.test']);
    });
  });

  [Events.SuiteStart, Events.SuiteEnd].forEach(event => {    
    s.test(`emits ${event} event`, async (t, { specsContainer, context }) => {
      let listener = createListener(event, context);

      specsContainer.describe('my suite', () => {});
      await runSpecsFromContainer(specsContainer, context);

      t.equal(listener.firstCall.args[0].name, 'my suite');
    });
  });

  s.test("emites test-start event", async (t, { specsContainer, context }) => {
    let listener = createListener(Events.TestStart, context);
    let skipListener = createListener(Events.TestSkip, context);
    specsContainer.test('my test', () => {});

    await runSpecsFromContainer(specsContainer, context);
    let testSummary = listener.firstCall.args[0];

    t.equal(testSummary.name, 'my test');
    t.equal(testSummary.executionResult, undefined);
    t.equal(skipListener.called, false);
  });

  s.test("emits test-end event", async (t, { specsContainer, context }) => {
    let listener = createListener(Events.TestEnd, context);
    specsContainer.test('my test', () => {});

    await runSpecsFromContainer(specsContainer, context);
    let testSummary = listener.firstCall.args[0];

    t.equal(testSummary.name, 'my test');
    t.assert(testSummary.executionResult);
  });

  s.test("emits test-skip event", async (t, { specsContainer, context }) => {
    let listener = createListener(Events.TestSkip, context);
    let startListener = createListener(Events.TestStart, context);
    specsContainer.xtest('my test', () => {});

    await runSpecsFromContainer(specsContainer, context);
    let testSummary = listener.firstCall.args[0];

    t.equal(testSummary.name, 'my test');
    t.assert(testSummary.executionResult);
    t.equal(startListener.called, false);
  });
});
