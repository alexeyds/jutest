import jutest from "jutest";
import { splitStackTrace } from "reporters/error_tracing";

jutest("reporters/error_tracing", s => {
  s.describe("splitStackTrace()", s => {
    let currentFileRegexp = /error_tracing_test/;

    s.test("removes error message from stack", t => {
      let result = splitStackTrace(new Error('foobar'));
      t.match(result[0], currentFileRegexp);
    });

    s.test("removes leading spaces from stack trace lines", t => {
      let result = splitStackTrace(new Error('foobar'));
      t.doesNotMatch(result[0], /^\s+/);
    });

    s.test("removes multi-line error messages", t => {
      let result = splitStackTrace(new Error('foobar\ntest'));
      t.match(result[0], currentFileRegexp);
    });
  });
});
