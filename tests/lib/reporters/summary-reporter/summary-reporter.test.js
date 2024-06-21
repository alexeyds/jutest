import { jutest } from "jutest";
import { createStdoutMock, TestRuntime } from "tests/support";
import { SummaryReporter } from "reporters";
import { RuntimeConfig } from "runtime/config";

jutest.describe("SummaryReporter", s => {
  s.setup(() => {
    let stdout = createStdoutMock();
    let runtimeConfig = RuntimeConfig.forReporter({ stdout });
    let reporterDetails = { reporterClass: SummaryReporter, runtimeConfig };

    return { reporterDetails, stdout, outputData: stdout.outputData };
  });

  s.test("reports the total number of tests", async (t, { reporterDetails, outputData }) => {
    await TestRuntime.runWithReporter(reporterDetails, s => {
      s.test('foo', () => {});
      s.test('bar', () => {});
    });

    let line = outputData[0];

    t.match(line, /\n$/);
    t.match(line, /Total: 2/);
    t.doesNotMatch(line, /Skipped/);
  });

  s.test("reports the number of failed tests", async (t, { reporterDetails, outputData }) => {
    await TestRuntime.runWithReporter(reporterDetails, s => {
      s.test('foo', t => t.assert(false));
      s.test('bar', () => {});
    });

    t.match(outputData[0], /Failed: 1/);
  });

  s.test("reports skipped tests", async (t, { reporterDetails, outputData }) => {
    await TestRuntime.runWithReporter(reporterDetails, s => {
      s.xtest('foo', () => {});
      s.test('bar', () => {});
    });

    t.match(outputData[0], /Skipped: 1/);
    t.match(outputData[0], /\n$/);
  });

  s.test("reports total run time", async (t, { reporterDetails, outputData }) => {
    await TestRuntime.runWithReporter(reporterDetails, () => {});
    let line = outputData[0];

    t.match(line, /run/i);
    t.match(line, /files/);
    t.match(line, /\n$/);
  });
});
