import { jutest } from "jutest";
import { Jutest } from "core";
import { TestRunSummary } from "test-runner/run-specs/test-run-summary";

function createTest(...args) {
  let jutestInstance = new Jutest();
  jutestInstance.test(...args);
  return jutestInstance.specs[0];
}

function createSkippedTest(...args) {
  let jutestInstance = new Jutest();
  jutestInstance.xtest(...args);
  return jutestInstance.specs[0];
}

jutest("TestRunSummary", s => {
  s.setup(() => {
    let runSummary = new TestRunSummary();
    return { runSummary };
  });

  s.describe("#startRun", s => {
    s.test("sets run start time", (t, { runSummary, jutestInstance }) => {
      runSummary.startRun();
      t.assert(runSummary.runStartedAt);
    });
  });

  s.describe("#endRun", s => {
    s.test("sets run end time and exit reason", (t, { runSummary }) => {
      runSummary.endRun({ exitReason: 'some-reason' });

      t.assert(runSummary.runEndedAt);
      t.equal(runSummary.exitReason, 'some-reason');
    });
  });

  s.describe("#addTestResult", s => {
    s.test("adds passed test result", async (t, { runSummary }) => {
      let test = createTest('my test', () => {});
      await test.run();
      runSummary.addTestResult(test);

      t.equal(runSummary.success, true);
      t.equal(runSummary.totalTestsCount, 1);
      t.equal(runSummary.passedTestsCount, 1);
      t.equal(runSummary.skippedTestsCount, 0);
      t.equal(runSummary.failedTestsCount, 0);
      t.assert(runSummary.testSummaries[0].executionResult.status);
    });

    s.test("adds failed test result", async (t, { runSummary }) => {
      let test = createTest('my test', t => { t.fail('foo'); });
      await test.run();
      runSummary.addTestResult(test);

      t.equal(runSummary.success, false);
      t.equal(runSummary.totalTestsCount, 1);
      t.equal(runSummary.failedTestsCount, 1);
      t.equal(runSummary.passedTestsCount, 0);
      t.equal(runSummary.skippedTestsCount, 0);
    });

    s.test("adds skipped test result", async (t, { runSummary }) => {
      let test = createSkippedTest('my test', t => { t.fail('foo'); });
      runSummary.addTestResult(test);

      t.equal(runSummary.success, true);
      t.equal(runSummary.totalTestsCount, 1);
      t.equal(runSummary.failedTestsCount, 0);
      t.equal(runSummary.passedTestsCount, 0);
      t.equal(runSummary.skippedTestsCount, 1);
    });

    s.test("returns added test summary", async (t, { runSummary }) => {
      let test = createTest('my test', () => {});
      await test.run();
      let testSummary = runSummary.addTestResult(test);

      t.equal(runSummary.testSummaries[0], testSummary);
    });
  });

  s.describe("#toObject", s => {
    s.test("extracts summary attributes", (t, { runSummary }) => {
      let object = runSummary.toObject();
      let keys = Object.keys(object);

      t.assert(keys.includes('runStartedAt', 'testSummaries', 'exitReason'));
    });
  });
});
