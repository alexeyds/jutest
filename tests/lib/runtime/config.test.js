import { jutest } from "jutest";
import { RuntimeConfig } from "runtime/config";

jutest("RuntimeConfig", s => {
  s.describe("constructor", s => {
    s.test("builds config with default attrs", t => {
      let config = new RuntimeConfig({});

      t.same(config.locationsToRun, []);
      t.same(config.includeTestFilePatterns, ["*.test.*"]);
      t.same(config.excludeTestFilePatterns, []);
      t.same(config.excludeTestDirectoryPatterns, []);
      t.assert(config.reportersConfig);
    });
  });
});
