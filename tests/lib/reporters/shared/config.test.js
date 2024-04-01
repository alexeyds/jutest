import { jutest } from "jutest";
import { ReporterConfig } from "reporters";

jutest("ReporterConfig", s => {
  s.test("sets default attributes", t => {
    let { stdout, trackedSourcePaths, ignoredSourcePaths } = new ReporterConfig();

    t.assert(stdout);
    t.assert(trackedSourcePaths.length);
    t.match(ignoredSourcePaths[0], 'node-modules');
  });

  s.test("allows overwriting attributes", t => {
    let config = new ReporterConfig({ stdout: '123', trackedSourcePaths: ['bar'], ignoredSourcePaths: ['foo']});

    t.equal(config.stdout, '123');
    t.match(config.trackedSourcePaths[0], 'bar');
    t.match(config.ignoredSourcePaths[0], 'foo');
  });

  s.test("resolves all paths to current dir", t => {
    let config = new ReporterConfig({ trackedSourcePaths: ['bar'], ignoredSourcePaths: ['foo']});

    t.match(config.trackedSourcePaths[0], process.cwd());
    t.match(config.ignoredSourcePaths[0], process.cwd());
  });
});
