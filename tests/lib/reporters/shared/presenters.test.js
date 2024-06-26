import { jutest } from "jutest";
import { attachStackFrame } from "tests/support";
import { AssertionFailedError } from "assertions";
import { presentErrorMessage, presentSourceDetails, presentTestLocation } from "reporters/shared";
import { RuntimeConfig } from "runtime/config";

jutest("failed-tests-reporter/presenter-helpers", s => {
  s.describe("presentErrorMessage", s => {
    s.test("presents regular errors", t => {
      let error = new Error("test");
      let message = presentErrorMessage(error);

      t.match(message, /Error/);
      t.match(message, /test/);
    });

    s.test("presents errors without a message", t => {
      let error = new Error();
      let message = presentErrorMessage(error);

      t.match(message, /Error/);
      t.match(message, /message/);
    });

    s.test("presents string errors", t => {
      let message = presentErrorMessage('test');
      t.match(message, 'test');
    });

    s.test("presents nullable error objects", t => {
      let message = presentErrorMessage(undefined);
      t.match(message, 'undefined');
    });

    s.test("presents assertion errors", t => {
      let error = new AssertionFailedError('foobar');
      let message = presentErrorMessage(error);

      t.equal(message, 'foobar');
    });
  });

  s.describe("presentSourceDetails", s => {
    s.setup(() => {
      let error = new Error();
      let config = new RuntimeConfig();

      return { config, error };
    });

    s.test("returns source details", async (t, { config, error }) => {
      let sourceDetails = await presentSourceDetails(error, config);

      t.assert(sourceDetails.stackFrames[0].file);
      t.assert(sourceDetails.sourceFrame.file);
      t.match(sourceDetails.sourceLine, /new Error/);
    });

    s.test("excludes internal frames from list", async (t, { config, error }) => {
      attachStackFrame(error, [`at addChunk (node:internal/${process.cwd()}:324:12)`]);
      let sourceDetails = await presentSourceDetails(error, config);

      t.equal(sourceDetails.stackFrames.length, 0);
    });

    s.test("replaces cwd in frames", async (t, { config, error }) => {
      let sourceDetails = await presentSourceDetails(error, config);
      t.match(sourceDetails.stackFrames[0].stackFrame, /\.\/tests/);
    });

    s.test("returns matchable source frame", async (t, { config, error }) => {
      let sourceDetails = await presentSourceDetails(error, config);
      let frame = sourceDetails.stackFrames.find(f => f === sourceDetails.sourceFrame);

      t.assert(frame);
    });

    s.test("supports string errors", async (t, { config }) => {
      let error = 'foo';
      let sourceDetails = await presentSourceDetails(error, config);

      t.same(sourceDetails.stackFrames, []);
      t.equal(sourceDetails.sourceFrame, null);
      t.match(sourceDetails.sourceLine, /stack/);
    });

    s.test("supports nullable objects", async (t, { config }) => {
      let error = undefined;
      let sourceDetails = await presentSourceDetails(error, config);

      t.same(sourceDetails.stackFrames, []);
    });

    s.test("only includes one frame in the stack for AssertionError", async (t, { config }) => {
      let error = new AssertionFailedError('foobar');
      let sourceDetails = await presentSourceDetails(error, config);

      t.equal(sourceDetails.stackFrames.length, 1);
      t.equal(sourceDetails.stackFrames[0], sourceDetails.sourceFrame);
    });

    s.test("includes full stack trace for AssertionError if source frame is missing", async (t) => {
      let error = new AssertionFailedError('foobar');
      let config = new RuntimeConfig({ trackedSourcePaths: ["./foo"] });
      let sourceDetails = await presentSourceDetails(error, config);

      t.assert(sourceDetails.stackFrames.length > 1);
    });

    s.test("removes file:// from frame", async (t, { config, error }) => {
      attachStackFrame(error, [`at file:///root/tests/lib/esm-calc.test.js:8:9`]);
      let sourceDetails = await presentSourceDetails(error, config);

      t.doesNotMatch(sourceDetails.stackFrames[0].stackFrame, 'file://');
    });

  });

  s.describe("presentTestLocation", s => {
    s.test("returns file and line number", t => {
      t.equal(presentTestLocation({ file: 'foo', lineNumber: 2 }), 'foo:2');
    });

    s.test("returns file only if there is no line number", t => {
      t.equal(presentTestLocation({ file: 'foo' }), 'foo');
    });

    s.test("returns empty string if there is no file", t => {
      t.equal(presentTestLocation({ lineNumber: 1 }), '');
    });

    s.test("replaces cwd in file name", t => {
      t.equal(presentTestLocation({ file: process.cwd() + '/foo', lineNumber: 1 }), './foo:1');
    });
  });
});
