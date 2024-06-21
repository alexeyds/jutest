import { jutest } from "jutest";
import { createStdoutMock, TestRuntime } from "tests/support";
import { FailedTestsReporter } from "reporters";
import { RuntimeConfig } from "runtime/config";

let currentFileName = 'failed-tests-reporter.test.js';

jutest("FailedTestsReporter", s => {
  s.setup(() => {
    let stdout = createStdoutMock();
    let runtimeConfig = new RuntimeConfig({ stdout, ignoredSourcePaths: ['lib'] });
    let reporterDetails = { reporterClass: FailedTestsReporter, runtimeConfig };

    return { reporterDetails, stdout, outputData: stdout.outputData };
  });

  s.test("does nothing if there are no failed tests", async (t, { reporterDetails, outputData }) => {
    await TestRuntime.runWithReporter(reporterDetails, s => {
      s.test('foo', () => {});
      s.test('bar', () => {});
    });

    t.same(outputData, []);
  });

  s.test("reports basic details about failed test", async (t, { reporterDetails, outputData }) => {
    await TestRuntime.runWithReporter(reporterDetails, s => {
      s.test('my failing test', (t) => t.equal(1, 2));
    });

    let [failuresLine, testDetails] = outputData;

    t.match(failuresLine, /failures/i);
    t.match(testDetails, 'my failing test');
    t.match(testDetails, 'expected');
    t.match(testDetails, /t\.equal\(1, 2\)/);
    t.match(testDetails, /failed-tests-reporter/);
  });

  s.test("reports basic details about skipped test", async (t, { reporterDetails, outputData }) => {
    await TestRuntime.runWithReporter(reporterDetails, s => {
      s.xtest('my skipped test', (t) => t.equal(1, 2));
    });

    let [failuresLine, testDetails] = outputData;

    t.match(failuresLine, /skipped/i);
    t.match(testDetails, 'my skipped test');
    t.match(testDetails, 'xtest');
  });

  s.test("includes test location in skipped test details", async (t, { reporterDetails, outputData }) => {
    let runtime = new TestRuntime({ ...reporterDetails, runAsFile: currentFileName });
    await runtime.defineAndRun(s => {
      s.xtest('my skipped test', (t) => t.equal(1, 2));
    });

    let [, testDetails] = outputData;

    t.match(testDetails, currentFileName);
  });
});
