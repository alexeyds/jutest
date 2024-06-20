import { jutest } from "jutest";
import { RuntimeConfig, ORDER_TYPES } from "runtime/config";

jutest("RuntimeConfig", s => {
  s.describe("constructor", s => {
    s.test("builds config with default attrs", t => {
      let config = new RuntimeConfig({});

      t.same(config.locationsToRun, []);
      t.assert(config.includeTestFilePatterns);
      t.assert(config.excludeTestFilePatterns);
      t.assert(config.excludeTestDirectoryPatterns);
      t.assert(config.seed)
      t.equal(config.order, ORDER_TYPES.random);
      t.assert(config.reportersConfig);
    });
  });
});
