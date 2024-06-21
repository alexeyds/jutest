import { jutest } from "jutest";
import { RuntimeConfig, ORDER_TYPES } from "runtime/config";

jutest("RuntimeConfig", s => {
  s.describe("constructor", s => {
    s.test("builds config with default attrs", t => {
      let config = new RuntimeConfig();

      t.same(config.locationsToRun, []);
      t.assert(config.includeTestFilePatterns);
      t.assert(config.excludeTestFilePatterns);
      t.assert(config.seed);
      t.equal(config.order, ORDER_TYPES.random);
      t.assert(config.stdout);
      t.assert(config.trackedSourcePaths.length);
      t.match(config.ignoredSourcePaths[0], 'node-modules');
      t.match(config.excludeTestDirectoryPaths[0], 'node-modules');
      t.assert(config.jutestRunCommand);
    });

    s.test("resolves all paths to current dir", t => {
      let config = new RuntimeConfig({
        locationsToRun: ['tests'],
        trackedSourcePaths: ['bar'],
        ignoredSourcePaths: ['foo'],
      });

      t.match(config.locationsToRun[0], process.cwd());
      t.match(config.trackedSourcePaths[0], process.cwd());
      t.match(config.ignoredSourcePaths[0], process.cwd());
      t.match(config.excludeTestDirectoryPaths[0], process.cwd());
    });
  });
});
