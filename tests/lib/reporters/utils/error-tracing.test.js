import { jutest } from "jutest";
import nodePath from 'path';
import { addPadding } from "reporters/utils/formatting";
import { traceFailedLine, readFailedLine } from "reporters/utils/error-tracing";

jutest("reporters/utils/error-tracing", s => {
  function tracedError(stackTraceLines) {
    let error = new Error('testing');
    let stackTrace = stackTraceLines.map(l => addPadding(`at ${l}:1:4`, 4)).join('\n');
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

      t.match(result, target);
    });

    s.test("has {excludeSourceDirs} option", t => {
      let target = sourceLine('/my_target');
      let error = tracedError(['/test', sourceLine('/node_modules/target'), target, '/foobar']);
      let result = traceFailedLine(error, { sourceDir, excludeSourceDirs: ['node_modules'] });

      t.match(result, target);
    });

    s.test("returns null by default", t => {
      let error = tracedError(['/test', '/foobar']);
      let result = traceFailedLine(error, { sourceDir });

      t.refute(result);
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
