import { jutest } from "jutest";
import { createStdoutMock, TestRuntime } from "tests/support";
import { RerunnableLocationsReporter } from "reporters";
import { RuntimeConfig } from "runtime/config";

let currentFileName = 'rerunnable-locations-reporter.test.js';

jutest("RerunnableLocationsReporter", s => {
  s.setup(() => {
    let stdout = createStdoutMock();
    let runtimeConfig = RuntimeConfig.forReporter({ stdout });
    let reporterDetails = { reporterClass: RerunnableLocationsReporter, runtimeConfig };

    return { reporterDetails, stdout, outputData: stdout.outputData };
  });

  s.test("does nothing if there are no failed tests", async (t, { reporterDetails, outputData }) => {
    await TestRuntime.runWithReporter(reporterDetails, s => {
      s.test('foo', () => {});
      s.test('bar', () => {});
    });

    t.same(outputData, []);
  });

  s.test("reports test location for failed test", async (t, { reporterDetails, outputData }) => {
    let runtime = new TestRuntime({ ...reporterDetails, runAsFile: currentFileName });
    await runtime.defineAndRun(s => {
      s.test('my failing test', (t) => t.equal(1, 2));
    });

    let [report] = outputData;

    t.match(report, currentFileName);
    t.match(report, 'my failing test');
  });

  s.test("does nothing if failed tests have no location", async (t, { reporterDetails, outputData }) => {
    await TestRuntime.runWithReporter(reporterDetails, s => {
      s.test('my failing test', (t) => t.equal(1, 2));
    });

    t.same(outputData, []);
  });
});
