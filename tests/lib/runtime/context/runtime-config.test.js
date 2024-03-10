import { jutest } from "jutest";
import { RuntimeConfig } from "runtime/context/runtime-config";

function createFileConfig(fileLocation) {
  return new RuntimeConfig({ fileLocations: [fileLocation] });
}

jutest("RuntimeConfig", s => {
  s.describe("constructor", s => {
    s.test("assigns defaults", t => {
      let config = new RuntimeConfig();

      t.same(config.fileLocations, []);
    });

    s.test("accepts configurable params", t => {
      let fileLocations = [{file: 'test.js', lineNumber: 13}];
      let config = new RuntimeConfig({ fileLocations });

      t.same(config.fileLocations, fileLocations);
    });
  });

  s.describe("isLocationRunnable", s => {
    s.test("returns true for any location if locations list is empty", t => {
      let config = new RuntimeConfig();
      t.equal(config.isLocationRunnable('foo.test', 14), true);
    });

    s.test("returns false if location doesn't match line number", t => {
      let config = createFileConfig({ file: 'foo.test', lineNumber: 14 });
      t.equal(config.isLocationRunnable('foo.test', 13), false);
    });

    s.test("returns true if line number matches", t => {
      let config = createFileConfig({ file: 'foo.test', lineNumber: 14 });
      t.equal(config.isLocationRunnable('foo.test', 14), true);
    });

    s.test("returns true if file has no line number", t => {
      let config = createFileConfig({ file: 'foo.test' });
      t.equal(config.isLocationRunnable('foo.test', 13), true);
    });

    s.test("returns true for all other files", t => {
      let config = createFileConfig({ file: 'foo.test', lineNumber: 13 });
      t.equal(config.isLocationRunnable('bar.test', 15), true);
    });

    s.test("supports multiple locations within the same file", t => {
      let config = new RuntimeConfig({ 
        fileLocations: [
          { file: 'foo.test', lineNumber: 13 },
          { file: 'foo.test', lineNumber: 15 }
        ]
      });

      t.equal(config.isLocationRunnable('foo.test', 13), true);
      t.equal(config.isLocationRunnable('foo.test', 15), true);
    });
  });
});
