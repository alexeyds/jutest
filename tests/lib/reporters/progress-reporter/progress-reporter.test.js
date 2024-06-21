import { jutest } from "jutest";
import { createStdoutMock, TestRuntime } from "tests/support";
import { ProgressReporter } from "reporters";
import { RuntimeConfig } from "runtime/config";

jutest("ProgressReporter", s => {
  s.setup(() => {
    let stdout = createStdoutMock();
    let runtimeConfig = RuntimeConfig.forReporter({ stdout });
    let reporterDetails = { reporterClass: ProgressReporter, runtimeConfig };

    return { reporterDetails, stdout, outputData: stdout.outputData };
  });

  s.test("reports passed tests", async (t, { reporterDetails, outputData }) => {
    await TestRuntime.runWithReporter(reporterDetails, s => {
      s.test('foo', () => {});
    });

    t.match(outputData[0], /\./);
  });

  s.test("reports failed tests", async (t, { reporterDetails, outputData }) => {
    await TestRuntime.runWithReporter(reporterDetails, s => {
      s.test('foo', (t) => t.fail('foobar'));
    });

    t.match(outputData[0], /F/);
  });

  s.test("reports skipped tests", async (t, { reporterDetails, outputData }) => {
    await TestRuntime.runWithReporter(reporterDetails, s => {
      s.xtest('foo', () => {});
    });

    t.match(outputData[0], /\*/);
  });

  s.test("does nothing if test count is 0", async (t, { reporterDetails, outputData }) => {
    await TestRuntime.runWithReporter(reporterDetails, () => {});

    t.same(outputData, []);
  });
});
