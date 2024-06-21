import { jutest } from "jutest";
import { RuntimeConfig, ORDER_TYPES } from "runtime/config";

jutest("RuntimeConfig", s => {
  s.describe("constructor", s => {
    s.test("builds config with default attrs", t => {
      let config = new RuntimeConfig();

      t.same(config.locationsToRun, []);
      t.assert(config.includeTestFilePatterns);
      t.assert(config.excludeTestFilePatterns);
      t.assert(config.excludeTestDirectoryPatterns);
      t.assert(config.seed)
      t.equal(config.order, ORDER_TYPES.random);
      t.assert(config.reporterConfig);
    });
  });

  s.describe(".reporterConfig", s => {
    s.test("sets default attributes", t => {
      let { reporterConfig } = new RuntimeConfig();

      t.assert(reporterConfig.stdout);
      t.assert(reporterConfig.trackedSourcePaths.length);
      t.match(reporterConfig.ignoredSourcePaths[0], 'node-modules');
      t.assert(reporterConfig.jutestRunCommand);
    });

    s.test("resolves all paths to current dir", t => {
      let { reporterConfig } = new RuntimeConfig({
        reporterConfig: {
          trackedSourcePaths: ['bar'],
          ignoredSourcePaths: ['foo'],
        }
      });

      t.match(reporterConfig.trackedSourcePaths[0], process.cwd());
      t.match(reporterConfig.ignoredSourcePaths[0], process.cwd());
    });
  });
});
