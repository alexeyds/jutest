import { jutest } from "jutest";
import { createStdoutMock, TestRuntime } from "tests/support";
import { SummaryReporter, ReporterConfig } from "reporters";

jutest.describe("SummaryReporter", s => {
  s.setup(() => {
    let stdout = createStdoutMock();
    let config = new ReporterConfig({ stdout });
    let reporter = new SummaryReporter(config);

    return { reporter, stdout, outputData: stdout.outputData };
  });

  s.test("reports the total number of tests", async (t, { reporter, outputData }) => {
    await TestRuntime.runWithReporter(reporter, s => {
      s.test('foo', () => {});
      s.test('bar', () => {});
    });

    let line = outputData[0];

    t.match(line, /\n$/);
    t.match(line, /Total: 2/);
    t.doesNotMatch(line, /Skipped/);
  });

  s.test("reports the number of failed tests", async (t, { reporter, outputData }) => {
    await TestRuntime.runWithReporter(reporter, s => {
      s.test('foo', t => t.assert(false));
      s.test('bar', () => {});
    });

    t.match(outputData[0], /Failed: 1/);
  });

  s.test("reports skipped tests", async (t, { reporter, outputData }) => {
    await TestRuntime.runWithReporter(reporter, s => {
      s.xtest('foo', () => {});
      s.test('bar', () => {});
    });

    t.match(outputData[0], /Skipped: 1/);
    t.match(outputData[0], /\n$/);
  });

  s.test("reports total run time", async (t, { reporter, outputData }) => {
    await TestRuntime.runWithReporter(reporter, () => {});
    let line = outputData[0];

    t.match(line, /run/i);
    t.match(line, /files/);
    t.match(line, /\n$/);
  });
});
