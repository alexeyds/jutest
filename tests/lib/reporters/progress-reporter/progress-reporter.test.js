import { jutest } from "jutest";
import { createStdoutMock, TestRuntime } from "tests/support";
import { ProgressReporter, ReporterConfig } from "reporters";

jutest("ProgressReporter", s => {
  s.setup(() => {
    let stdout = createStdoutMock();
    let config = new ReporterConfig({ stdout });
    let reporter = new ProgressReporter(config);

    return { reporter, stdout, outputData: stdout.outputData };
  });

  s.test("reports passed tests", async (t, { reporter, outputData }) => {
    await TestRuntime.runWithReporter(reporter, s => {
      s.test('foo', () => {});
    });

    t.match(outputData[0], /\./);
  });

  s.test("reports failed tests", async (t, { reporter, outputData }) => {
    await TestRuntime.runWithReporter(reporter, s => {
      s.test('foo', (t) => t.fail('foobar'));
    });

    t.match(outputData[0], /F/);
  });

  s.test("reports skipped tests", async (t, { reporter, outputData }) => {
    await TestRuntime.runWithReporter(reporter, s => {
      s.xtest('foo', () => {});
    });

    t.match(outputData[0], /\*/);
  });

  s.test("does nothing if test count is 0", async (t, { reporter, outputData }) => {
    await TestRuntime.runWithReporter(reporter, () => {});

    t.same(outputData, []);
  });
});
