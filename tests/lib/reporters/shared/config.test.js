import { jutest } from "jutest";
import { ReporterConfig } from "reporters";

jutest("ReporterConfig", s => {
  s.test("sets default attributes", t => {
    let { stdout, includeSourceDirs, excludeSourceDirs } = new ReporterConfig();

    t.assert(stdout);
    t.assert(includeSourceDirs.length);
    t.match(excludeSourceDirs[0], 'node-modules');
  });

  s.test("allows overwriting attributes", t => {
    let config = new ReporterConfig({ stdout: '123', includeSourceDirs: ['bar'], excludeSourceDirs: ['foo']});

    t.equal(config.stdout, '123');
    t.match(config.includeSourceDirs[0], 'bar');
    t.match(config.excludeSourceDirs[0], 'foo');
  });

  s.test("resolves all paths to current dir", t => {
    let config = new ReporterConfig({ includeSourceDirs: ['bar'], excludeSourceDirs: ['foo']});

    t.match(config.includeSourceDirs[0], process.cwd());
    t.match(config.excludeSourceDirs[0], process.cwd());
  });
});
