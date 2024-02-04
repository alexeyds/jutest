import { jutest } from "jutest";
import { formatStackFrames } from "utils/error-formatting";

jutest("utils/error-formatting", s => {
  s.describe("formatStackFrames()", s => {
    let currentFileRegexp = /error-formatting\.test/;

    s.test("removes error message from stack", t => {
      let result = formatStackFrames(new Error('foobar'));
      t.match(result[0], currentFileRegexp);
    });

    s.test("removes leading spaces from stack trace lines", t => {
      let result = formatStackFrames(new Error('foobar'));
      t.doesNotMatch(result[0], /^\s+/);
    });

    s.test("removes multi-line error messages", t => {
      let result = formatStackFrames(new Error('foobar\ntest'));
      t.match(result[0], currentFileRegexp);
    });
  });
});
