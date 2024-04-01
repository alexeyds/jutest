import { jutest } from "jutest";
import { ErrorStackParser } from "utils/error-stack-parser";

jutest("ErrorStackParser", s => {
  s.describe("constructor", s => {
    s.test("sets default attributes", t => {
      let parser = new ErrorStackParser(new Error());
      t.assert(parser.error);
    });
  });

  s.describe("#message", s => {
    s.test("return error message", t => {
      let parser = new ErrorStackParser(new Error('test'));
      t.equal(parser.message, 'test');
    });
  });

  s.describe("#stackWithoutMessage", s => {
    s.test("return stack", t => {
      let parser = new ErrorStackParser(new Error('test'));
      t.match(parser.stackWithoutMessage, 'error-stack-parser');
    });

    s.test("removes error message and name from stack", t => {
      let parser = new ErrorStackParser(new Error('foobar test'));

      t.doesNotMatch(parser.stackWithoutMessage, /Error:/);
      t.doesNotMatch(parser.stackWithoutMessage, 'foobar test');
    });

    s.test("removes error name if error has no message", t => {
      let parser = new ErrorStackParser(new Error());
      t.doesNotMatch(parser.stackWithoutMessage, 'Error');
    });
  });

  s.describe("#stackFrames", s => {
    s.test("returns parsed stack frames", t => {
      let { stackFrames } = new ErrorStackParser(new Error());
      let [frame] = stackFrames;

      t.match(frame.stackFrame, 'at');
      t.assert(frame.file);
      t.assert(frame.lineNumber);
    });

    s.test("works with errors with message", t => {
      let { stackFrames } = new ErrorStackParser(new Error('foobar'));
      let [frame] = stackFrames;

      t.match(frame.stackFrame, 'at');
      t.assert(frame.file);
      t.assert(frame.lineNumber);
    });

    s.test("caches return value", t => {
      let parser = new ErrorStackParser(new Error());
      t.equal(parser.stackFrames, parser.stackFrames);
    });
  });
});
