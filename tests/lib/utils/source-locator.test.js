import { jutest } from "jutest";
import { SourceLocator } from "utils/source-locator";

jutest("SourceLocator", s => {
  let ownFileName = 'source-locator.test.js';

  s.describe("constructor()", s => {
    s.test("sets default attributes", t => {
      let locator = new SourceLocator();

      t.assert(locator.sourceError);
      t.refute(locator.sourceFilePath);
    });

    s.test("accepts sourceError", t => {
      let sourceError = new Error();
      let locator = new SourceLocator({ sourceError });

      t.equal(locator.sourceError, sourceError);
    });

    s.test("accepts sourceFilePath", t => {
      let locator = new SourceLocator({ sourceFilePath: ownFileName });
      t.equal(locator.sourceFilePath, ownFileName);
    });
  });

  s.describe("#lineNumbers", s => {
    s.test("returns empty array by default", t => {
      let locator = new SourceLocator();
      t.same(locator.lineNumbers, []);
    });

    s.test("returns line number in source file path", t => {
      let locator = new SourceLocator({ sourceFilePath: ownFileName });
      t.same(locator.lineNumbers, [35]);
    });

    s.test("returns undefined if line not found in the file", t => {
      let locator = new SourceLocator({ sourceFilePath: 'foo.test.js' });
      t.same(locator.lineNumbers, []);
    });

    s.test("correctly handles error with stack frames without files", t => {
      let error = new Error();
      error.stack = 'at <anonymous>';
      let locator = new SourceLocator({ sourceError: error, sourceFilePath: 'foo.test.js' });
      
      t.same(locator.lineNumbers, []);
    });
  });

  s.describe("#lineNumber", s => {
    s.test("returns undefined by default", t => {
      let locator = new SourceLocator();
      t.refute(locator.lineNumber);
    });

    s.test("returns line number in source file path", t => {
      let locator = new SourceLocator({ sourceFilePath: ownFileName });
      t.assert(locator.lineNumber);
    });
  });
});
