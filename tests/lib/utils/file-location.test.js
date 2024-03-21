import { jutest } from "jutest";
import { fileLocation, parseFileLocation } from "utils/file-location";

jutest("utils/file-location", s => {
  s.describe("fileLocation()", s => {
    s.test("returns location", t => {
      t.same(fileLocation('my-file.js'), { file: 'my-file.js', lineNumbers: [] });
    });

    s.test("returns location with line numbers", t => {
      t.same(fileLocation('my-file.js', [14]), { file: 'my-file.js', lineNumbers: [14] });
    });
  });

  s.describe("parseFileLocation()", s => {
    s.test("parses path with line number", t => {
      let locations = parseFileLocation("my-file.js:14");
      t.same(locations, fileLocation('my-file.js', [14]));
    });

    s.test("parses paths without line number", t => {
      let locations = parseFileLocation("my-file.js");
      t.same(locations, fileLocation('my-file.js'));
    });

    s.test("parses paths which include :", t => {
      let locations = parseFileLocation("C:/my-file.js:15");
      t.same(locations, fileLocation('C:/my-file.js', [15]));
    });

    s.test("parses multiple line numbers", t => {
      let locations = parseFileLocation("my-file.js:15:61");
      t.same(locations, fileLocation('my-file.js', [15, 61]));
    });

    s.test("works with unusual paths", t => {
      let locations = parseFileLocation("my:14file.js:15");
      t.same(locations, fileLocation('my:14file.js', [15]));
    });
  });
});
