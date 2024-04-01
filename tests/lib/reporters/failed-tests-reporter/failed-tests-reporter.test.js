import { jutest } from "jutest";
import { createStdoutMock, TestRuntime } from "tests/support";
import { FailedTestsReporter, ReporterConfig } from "reporters";

jutest("FailedTestsReporter", s => {
  s.setup(() => {
    let stdout = createStdoutMock();
    let config = new ReporterConfig({ stdout, ignoredSourcePaths: ['lib'] });
    let reporter = new FailedTestsReporter(config);

    return { reporter, stdout, outputData: stdout.outputData };
  });

  s.describe("#finishReporting", s => {
    s.test("does nothing if there are no failed tests", async (t, { reporter, outputData }) => {
      await TestRuntime.runWithReporter(reporter, s => {
        s.test('foo', () => {});
        s.test('bar', () => {});
      });

      t.same(outputData, []);
    });

    s.test("reports basic details about failed test", async (t, { reporter, outputData }) => {
      await TestRuntime.runWithReporter(reporter, s => {
        s.test('my failing test', (t) => t.equal(1, 2));
      });

      let [failuresLine, testDetails] = outputData;

      t.match(failuresLine, /failures/i);
      t.match(failuresLine, /\n$/);
      t.match(testDetails, 'my failing test');
      t.match(testDetails, 'expected');
      t.match(testDetails, /t\.equal\(1, 2\)/);
      t.match(testDetails, /failed-tests-reporter/);
    });
  });
});
