import { jutest } from "jutest";
import { ReporterConfig } from "reporters";

jutest("ReporterConfig", s => {
  s.test("sets default attributes", t => {
    let config = new ReporterConfig();

    t.assert(config.stdout);
    t.assert(config.trackedSourcePaths.length);
    t.match(config.ignoredSourcePaths[0], 'node-modules');
    t.assert(config.jutestRunCommand);
  });

  s.test("allows overwriting attributes", t => {
    let config = new ReporterConfig({
      stdout: '123',
      trackedSourcePaths: ['bar'],
      ignoredSourcePaths: ['foo'],
      jutestRunCommand: 'foobar'
    });

    t.equal(config.stdout, '123');
    t.match(config.trackedSourcePaths[0], 'bar');
    t.match(config.ignoredSourcePaths[0], 'foo');
    t.equal(config.jutestRunCommand, 'foobar');
  });

  s.test("resolves all paths to current dir", t => {
    let config = new ReporterConfig({ trackedSourcePaths: ['bar'], ignoredSourcePaths: ['foo']});

    t.match(config.trackedSourcePaths[0], process.cwd());
    t.match(config.ignoredSourcePaths[0], process.cwd());
  });
});
