import { jutest } from "jutest";
import { Test, TestContext } from "core";
import { ExitReasons } from "runtime/test-runner/enums";
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

      t.equal(runSummary.success, true);
      t.equal(runSummary.totalTestsCount, 1);
      t.equal(runSummary.passedTestsCount, 1);
      t.equal(runSummary.skippedTestsCount, 0);
      t.equal(runSummary.failedTestsCount, 0);
      t.equal(runSummary.testSummaries[0].executionResult.status, Test.ExecutionStatuses.Passed);
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
      let context = new TestContext();
      let test = new Test('my test', t => { t.fail('foo'); }, { context, skip: true });
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
