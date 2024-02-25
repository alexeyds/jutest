import { jutest } from "jutest";
import { Test, TestContext } from "core";
import { ExitReasons, TestStatuses } from "runtime/test-runner/enums";
import { TestRunSummary } from "runtime/test-runner/test-run-summary";

function createTest(...args) {
  let context = new TestContext();
  return new Test(...args, { context });
}

jutest("TestRunSummary", s => {
  s.setup(() => {
    let runSummary = new TestRunSummary();
    return { runSummary };
  });

  s.describe("#startRun", s => {
    s.test("sets run start time", (t, { runSummary }) => {
      runSummary.startRun();
      t.assert(runSummary.runStartedAt);
    });
  });

  s.describe("#endRun", s => {
    s.test("sets run end time and exit reason", (t, { runSummary }) => {
      runSummary.endRun({ exitReason: ExitReasons.RunEnd });

      t.assert(runSummary.runEndedAt);
      t.equal(runSummary.exitReason, ExitReasons.RunEnd);
    });
  });

  s.describe("#addTestResult", s => {
    s.test("adds passed test result", async (t, { runSummary }) => {
      let test = createTest('my test', () => {});
      await test.run();
      runSummary.addTestResult(test);

      t.equal(runSummary.totalTestsCount, 1);
      t.equal(runSummary.passedTestsCount, 1);
      t.equal(runSummary.skippedTestsCount, 0);
      t.equal(runSummary.failedTestsCount, 0);
      t.equal(runSummary.testSummaries[0].executionResult.status, TestStatuses.Passed);
    });

    s.test("adds failed test result", async (t, { runSummary }) => {
      let test = createTest('my test', t => { t.fail('foo'); });
      await test.run();
      runSummary.addTestResult(test);

      t.equal(runSummary.totalTestsCount, 1);
      t.equal(runSummary.failedTestsCount, 1);
      t.equal(runSummary.passedTestsCount, 0);
      t.equal(runSummary.skippedTestsCount, 0);
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

      t.equal(object.runStartedAt, null);
      t.equal(object.runEndedAt, null);
      t.equal(object.exitReason, null);
      t.equal(object.totalTestsCount, 0);
      t.equal(object.passedTestsCount, 0);
      t.equal(object.skippedTestsCount, 0);
      t.equal(object.failedTestsCount, 0);
      t.same(object.testSummaries, []);
    });
  });
});
