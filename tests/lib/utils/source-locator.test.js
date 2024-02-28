import { jutest } from "jutest";
import { SourceLocator } from "utils/source-locator";

jutest("utils/source-locator", s => {
  let currentFileRegexp = /source-locator\.test/;
  let ownFileName = 'source-locator.test.js';

  s.describe("#locations", s => {
    s.test("returns parsed source locations", t => {
      let locator = new SourceLocator();
      let location = locator.locations[1];

      t.match(location.stackFrame, currentFileRegexp);
      t.equal(location.lineNumber, 10);
    });

    s.test("caches the definitions", t => {
      let locator = new SourceLocator();
      t.equal(locator.locations, locator.locations);
    });
  });

  s.describe("constructor()", s => {
    s.test("accepts sourceError", t => {
      let locator = new SourceLocator({ sourceError: new Error() });
      let location = locator.locations[0];

      t.match(location.stackFrame, currentFileRegexp);
    });
  });

  s.describe("#guessLineNumberInFile", s => {
    s.test("returns source line in the matching file", t => {
      let locator = new SourceLocator();
      let lineNumber = locator.guessLineNumberInFile('source-locator.test.js');

      t.equal(lineNumber, 34);
    });

    s.test("returns latest source line from multiple definitions", t => {
      let locator = buildSourceLocator();

      function buildSourceLocator() {
        return new SourceLocator();
      }

      let lineNumber = locator.guessLineNumberInFile('source-locator.test.js');

      t.equal(lineNumber, 41);
    });

    s.test("returns undefined when location is not found", t => {
      let locator = new SourceLocator();
      let lineNumber = locator.guessLineNumberInFile('foobar.test.js');

      t.equal(lineNumber, undefined);
    });
  });

  s.describe("#setSourceFile", s => {
    s.test("sets file to the provided one", t => {
      let locator = new SourceLocator();
      locator.setSourceFile('foobar.test.js');

      t.equal(locator.filePath, 'foobar.test.js');
    });

    s.test("sets found location from the given file", t => {
      let locator = new SourceLocator();
      locator.setSourceFile(ownFileName);

      t.equal(locator.lineNumber, 69);
    });
  });
});
