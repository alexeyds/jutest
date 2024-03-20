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

  s.describe("#stackFrames", s => {
    s.test("returns parsed stack frames", t => {
      let { stackFrames } = new ErrorFormatter(new Error());
      let [frame] = stackFrames;

      t.assert(frame.file);
      t.assert(frame.lineNumber);
      t.match(frame.stackFrame, 'at');
    });

    s.test("caches return value", t => {
      let formatter = new ErrorFormatter(new Error());
      t.equal(formatter.stackFrames, formatter.stackFrames);
    });
  });
});
