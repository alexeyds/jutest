import jutest from "jutest";
import nodePath from 'path';
import { addPadding } from "reporters/formatting";
import { splitStackTrace, traceFailedLine, readFailedLine } from "reporters/error_tracing";

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

  function tracedError(stackTraceLines) {
    let error = new Error('testing');
    let stackTrace = stackTraceLines.map(l => addPadding(l, 4)).join('\n');
    error.stack = `${error.name}: ${error.message}\n${stackTrace}`;
    return error;
  }

  s.describe("traceFailedLine()", s => {
    let sourceDir = '/foobar/test/source';
    let sourceLine = path => nodePath.join(sourceDir, path);

    s.test("returns first line matching sourceDir", t => {
      let target = sourceLine('/my_target');
      let error = tracedError(['/test', target, '/foobar']);
      let result = traceFailedLine(error, { sourceDir });

      t.equal(result, target);
    });

    s.test("has {excludeSourceDirs} option", t => {
      let target = sourceLine('/my_target');
      let error = tracedError(['/test', sourceLine('/node_modules/target'), target, '/foobar']);
      let result = traceFailedLine(error, { sourceDir, excludeSourceDirs: ['node_modules'] });

      t.equal(result, target);
    });

    s.test("returns null by default", t => {
      let error = tracedError(['/test', '/foobar']);
      let result = traceFailedLine(error, { sourceDir });

      t.equal(result, null);
    });

    s.test("matches directories exactly", t => {
      let error = tracedError([sourceLine('/tests')]);
      let result = traceFailedLine(error, { sourceDir, excludeSourceDirs: ['test'] });

      t.notEqual(result, null);
    });
  });

  s.describe("readFailedLine()", s => {
    let sourceDir = process.cwd();

    s.test("reads failed line from source file", async t => {
      let error = new Error('my error');
      let result = await readFailedLine(error, { sourceDir });

      t.match(result, /my error/);
    });

    s.test("returns null if line not found", async t => {
      let error = tracedError(['/foobar']);
      let result = await readFailedLine(error, { sourceDir });

      t.equal(result, null);
    });

    s.test("returns null if file/line number cannot be parsed", async t => {
      let error = tracedError([nodePath.join(sourceDir, '/test.js')]);
      let result = await readFailedLine(error, { sourceDir });

      t.equal(result, null);
    });

    s.test("returns null if file is not found", async t => {
      let error = tracedError([nodePath.join(sourceDir, '/test.js:31')]);
      let result = await readFailedLine(error, { sourceDir });

      t.equal(result, null);
    });
  });
});
