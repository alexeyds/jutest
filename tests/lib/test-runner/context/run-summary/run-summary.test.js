import { jutest } from "jutest";
import { Jutest } from "core";
import { RunSummary } from "test-runner/context/run-summary";
import { TestRunnerEnums } from "test-runner/enums";

let { ExitReasons } = TestRunnerEnums;

jutest("RunSummary", s => {
  s.setup(() => {
    let runSummary = new RunSummary();
    let jutestInstance = new Jutest();

    return { runSummary, jutestInstance };
  });

  s.describe("constructor", s => {
    s.test("sets default attributes", (t, { runSummary }) => {
      t.equal(runSummary.success, true);
      t.equal(runSummary.exitReason, null);
      t.equal(runSummary.totalTestsCount, 0);
      t.equal(runSummary.runTestsCount, 0);
      t.equal(runSummary.passedTestsCount, 0);
      t.equal(runSummary.skippedTestsCount, 0);
      t.equal(runSummary.failedTestsCount, 0);
      t.equal(runSummary.runTime, 0);
      t.same(runSummary.testSummaries, []);
      t.same(runSummary.fileLoadTimes, []);
    });
  });

  s.describe("setFileLoadTime", s => {
    s.test("adds file loading time to array", (t, { runSummary }) => {
      runSummary.setFileLoadTime('foo.js', 123);
      t.same(runSummary.fileLoadTimes, [ { file: 'foo.js', loadTime: 123 } ]);
    });
  });

  s.describe("setTotalTestsCount", s => {
    s.test("sets tests count", (t, { runSummary }) => {
      runSummary.setTotalTestsCount(10);
      t.equal(runSummary.totalTestsCount, 10);
    });
  });

  s.describe("setRunTime", s => {
    s.test("sets run time", (t, { runSummary }) => {
      runSummary.setRunTime(10);
      t.equal(runSummary.runTime, 10);
    });
  });

  s.describe("buildSpecSummary", s => {
    s.test("returns spec summary", (t, { runSummary, jutestInstance }) => {
      let test = jutestInstance.specsContainer.test('my test', () => {});
      let specSummary = runSummary.buildSpecSummary(test);

      t.assert(specSummary.name, 'my test');
    });
  });

  s.describe("#addTestResult", s => {
    s.test("adds passed test result", async (t, { runSummary, jutestInstance }) => {
      let test = jutestInstance.specsContainer.test('my test', () => {});
      await test.run();
      runSummary.addTestResult(test);

      t.equal(runSummary.success, true);
      t.equal(runSummary.runTestsCount, 1);
      t.equal(runSummary.passedTestsCount, 1);
      t.equal(runSummary.skippedTestsCount, 0);
      t.equal(runSummary.failedTestsCount, 0);
      t.assert(runSummary.testSummaries[0].executionResult.status);
    });

    s.test("adds failed test result", async (t, { runSummary, jutestInstance }) => {
      let test = jutestInstance.specsContainer.test('my test', t => { t.fail('foo'); });
      await test.run();
      runSummary.addTestResult(test);

      t.equal(runSummary.success, false);
      t.equal(runSummary.runTestsCount, 1);
      t.equal(runSummary.failedTestsCount, 1);
      t.equal(runSummary.passedTestsCount, 0);
      t.equal(runSummary.skippedTestsCount, 0);
    });

    s.test("adds skipped test result", async (t, { runSummary, jutestInstance }) => {
      let test = jutestInstance.specsContainer.xtest('my test', t => { t.fail('foo'); });
      runSummary.addTestResult(test);

      t.equal(runSummary.success, true);
      t.equal(runSummary.runTestsCount, 1);
      t.equal(runSummary.failedTestsCount, 0);
      t.equal(runSummary.passedTestsCount, 0);
      t.equal(runSummary.skippedTestsCount, 1);
    });

    s.test("returns added test summary", async (t, { runSummary, jutestInstance }) => {
      let test = jutestInstance.specsContainer.test('my test', () => {});
      await test.run();
      let testSummary = runSummary.addTestResult(test);

      t.equal(runSummary.testSummaries[0], testSummary);
    });
  });

  s.describe("exits", s => {
    s.test("has exitWithRunEnd", (t, { runSummary }) => {
      runSummary.exitWithRunEnd();

      t.assert(runSummary.exitReason);
      t.equal(runSummary.exitReason, ExitReasons.RunEnd);
    });

    s.test("has exitWithTeardownError", (t, { runSummary }) => {
      runSummary.exitWithTeardownError();

      t.assert(runSummary.exitReason);
      t.equal(runSummary.exitReason, ExitReasons.TeardownError);
    });

    s.test("has exitWithInterrupt", (t, { runSummary }) => {
      runSummary.exitWithInterrupt();

      t.assert(runSummary.exitReason);
      t.equal(runSummary.exitReason, ExitReasons.Interrupt);
    });
  });

  s.describe("#toObject", s => {
    s.test("extracts summary attributes", (t, { runSummary }) => {
      let object = runSummary.toObject();
      let keys = Object.keys(object);

      t.assert(keys.includes('testSummaries', 'exitReason'));
    });
  });
});
