import { jutest } from "jutest";
import nodePath from "path";
import { readLine, resolveToCwd, isDirectory, mapDirectory } from "utils/file";

let fixturePath = f => nodePath.join(process.cwd(), 'tests/lib/utils/file/fixtures', f);
let fiveLinesFilePath = fixturePath('five-lines-file.txt');

jutest("utils/file", s => {
  s.describe("readLine()", s => {
    s.test("returns read line", async t => {
      let result = await readLine(fiveLinesFilePath, 3); 

      t.equal(result.success, true);
      t.equal(result.error, null);
      t.equal(result.line, 'line 3');
    });

    s.test("returns error if file not found", async t => {
      let result = await readLine(fixturePath('no_such_file.txt'), 3); 

      t.equal(result.success, false);
      t.match(result.error, /no_such_file/);
      t.equal(result.line, null);
    });

    s.test("returns error if line not found", async t => {
      let result = await readLine(fiveLinesFilePath, 10); 

      t.equal(result.success, false);
      t.match(result.error, /10/);
      t.equal(result.line, null);
    });

    s.test("returns success if line is empty string", async t => {
      let result = await readLine(fiveLinesFilePath, 6);

      t.equal(result.success, true);
      t.equal(result.error, null);
      t.equal(result.line, '');
    });
  });

  s.describe("resolveToCwd", s => {
    s.test("resolves path to cwd", t => {
      t.equal(resolveToCwd('bar'), process.cwd() + '/bar');
      t.equal(resolveToCwd('/bar'),'/bar');
    });
  });

  s.describe("isDirectory()", s => {
    s.test("returns true if path is a directory", t => {
      t.equal(isDirectory(fixturePath('')), true);
    });

    s.test("returns false if path is a file", t => {
      t.equal(isDirectory(fiveLinesFilePath), false);
    });
  });

  s.describe("mapDirectory", s => {
    s.test("calls map function for each item in the directory and returns the result", t => {
      let result = mapDirectory(fixturePath(''), path => ({ path }));
      t.same(result, [{ path: fiveLinesFilePath }]);
    });
  });
});
