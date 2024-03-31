import { jutest } from "jutest";
import { ErrorFormatter } from "utils/error-formatter";

jutest("ErrorFormatter", s => {
  s.describe("constructor", s => {
    s.test("sets default attributes", t => {
      let formatter = new ErrorFormatter(new Error());
      t.assert(formatter.error);
    });
  });

  s.describe("#message", s => {
    s.test("return error message", t => {
      let formatter = new ErrorFormatter(new Error('test'));
      t.equal(formatter.message, 'test');
    });
  });

  s.describe("#stack", s => {
    s.test("return stack", t => {
      let formatter = new ErrorFormatter(new Error('test'));
      t.match(formatter.stack, 'error-formatter');
    });

    s.test("removes error message and name from stack", t => {
      let formatter = new ErrorFormatter(new Error('foobar test'));

      t.doesNotMatch(formatter.stack, /Error:/);
      t.doesNotMatch(formatter.stack, 'foobar test');
    });

    s.test("removes error name if error has no message", t => {
      let formatter = new ErrorFormatter(new Error());
      t.doesNotMatch(formatter.stack, 'Error');
    });
  });

  s.describe("#stackFrames", s => {
    s.test("returns parsed stack frames", t => {
      let { stackFrames } = new ErrorFormatter(new Error());
      let [frame] = stackFrames;

      t.assert(frame.file);
      t.assert(frame.lineNumber);
      t.match(frame.stackFrame, 'at');
    });

    s.test("works with errors with message", t => {
      let { stackFrames } = new ErrorFormatter(new Error('foobar'));
      let [frame] = stackFrames;

      t.match(frame.stackFrame, 'at');
      t.assert(frame.file);
      t.assert(frame.lineNumber);
    });

    s.test("caches return value", t => {
      let formatter = new ErrorFormatter(new Error());
      t.equal(formatter.stackFrames, formatter.stackFrames);
    });
  });
});
