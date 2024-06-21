import { jutest } from "jutest";
import { attachStackFrame } from "tests/support";
import { ErrorSourceTracer } from "reporters/shared";
import { RuntimeConfig } from "runtime/config";

function buildSourceTracer(error, config) {
  return new ErrorSourceTracer(error, new RuntimeConfig(config));
}

jutest("ErrorSourceTracer", s => {
  s.setup(() => {
    let error = new Error("test error");
    return { error };
  });

  s.describe("#constructor", s => {
    s.test("sets error attributes", (t, { error }) => {
      let tracer = buildSourceTracer(error);

      t.equal(tracer.error, error);
      t.assert(tracer.stackParser);
    });
  });

  s.describe("#sourceFrame", s => {
    s.test("returns first frame in the list", (t, { error }) => {
      let tracer = buildSourceTracer(error);
      t.equal(tracer.sourceFrame, tracer.stackFrames[0]);
    });

    s.test("excludes any sources that dont match trackedSourcePaths", (t, { error }) => {
      let tracer = buildSourceTracer(error, { trackedSourcePaths: ["/root"] });
      t.equal(tracer.sourceFrame, undefined);
    });

    s.test("matches start of the file for trackedSourcePaths", (t, { error }) => {
      let tracer = buildSourceTracer(error, { trackedSourcePaths: ['/jutest'] });
      t.equal(tracer.sourceFrame, undefined);
    });

    s.test("excludes any sources from ignoredSourcePaths", (t, { error }) => {
      let tracer = buildSourceTracer(error, { ignoredSourcePaths: [process.cwd()] });
      t.equal(tracer.sourceFrame, undefined);
    });

    s.test("matches start of the file for ignoredSourcePaths", (t, { error }) => {
      let tracer = buildSourceTracer(error, { ignoredSourcePaths: ['/jutest'] });
      t.assert(tracer.sourceFrame);
    });

    s.test("excludes frames without a file", (t, { error }) => {
      attachStackFrame(error, ["at eval <anonymous>:1:8)"]);
      let tracer = buildSourceTracer(error);

      t.equal(tracer.sourceFrame, undefined);
    });

    s.test("excludes internal frames", (t, { error }) => {
      attachStackFrame(error, [`at addChunk (node:internal/${process.cwd()}:324:12)`]);
      let tracer = buildSourceTracer(error);
      
      t.equal(tracer.sourceFrame, undefined);
    });
  });

  s.describe("#readSourceLine", s => {
    s.test("reads line in the source file", async (t, { error }) => {
      let tracer = buildSourceTracer(error);
      let line = await tracer.readSourceLine();

      t.match(line, /test error/);
      t.doesNotMatch(line, /^\s+/);
    });

    s.test("returns undefined if stack frame is not found", async (t, { error }) => {
      let tracer = buildSourceTracer(error, { ignoredSourcePaths: [process.cwd()] });
      let line = await tracer.readSourceLine();

      t.equal(line, undefined);
    });

    s.test("returns file reading errors", async (t, { error }) => {
      attachStackFrame(error, [`at baz (${process.cwd()}/does-not-exist.js:10:15)`]);
      let tracer = buildSourceTracer(error);
      let line = await tracer.readSourceLine();

      t.match(line, /does-not-exist/);
    });
  });
});
