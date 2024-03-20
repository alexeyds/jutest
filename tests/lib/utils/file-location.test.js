import { jutest } from "jutest";
import { fileLocation, parseFileLocations } from "utils/file-location";

jutest("utils/file-location", s => {
  s.describe("fileLocation()", s => {
    s.test("returns location", t => {
      t.same(fileLocation('my-file.js', 14), { file: 'my-file.js', lineNumber: 14 });
    });
  });

  s.test("parses path with line number", t => {
    let locations = parseFileLocations("my-file.js:14");
    t.same(locations, [ fileLocation('my-file.js', 14) ]);
  });

  s.test("parses paths without line number", t => {
    let locations = parseFileLocations("my-file.js");
    t.same(locations, [ fileLocation('my-file.js') ]);
  });

  s.test("parses paths which include :", t => {
    let locations = parseFileLocations("C:/my-file.js:15");
    t.same(locations, [ fileLocation('C:/my-file.js', 15) ]);
  });

  s.test("parses multiple line numbers", t => {
    let locations = parseFileLocations("my-file.js:15:61");

    t.same(locations, [
      fileLocation('my-file.js', 15),
      fileLocation('my-file.js', 61)
    ]);
  });

  s.test("works with unusual paths", t => {
    let locations = parseFileLocations("my:14file.js:15");
    t.same(locations, [ fileLocation('my:14file.js', 15) ]);
  });
});
