import { jutest } from "jutest";
import { parseArgv } from "runtime/cli/parse-argv";
import { ORDER_TYPES } from "runtime/config";

jutest("parseArgv", s => {
  function buildArgv(...args) {
    return ['bin/node', 'bin/test', ...args];
  }

  s.test("returns empty config by default", t => {
    let { runtimeConfig, configFilePath } = parseArgv(buildArgv());

    t.same(runtimeConfig, {});
    t.equal(configFilePath, undefined);
  });

  s.test("includes test locations in config", t => {
    let { runtimeConfig } = parseArgv(buildArgv('test.js'));
    t.same(runtimeConfig.locationsToRun, ['test.js']);
  });

  s.test("returns parsedArgv", t => {
    let { parsedArgv } = parseArgv(buildArgv());
    t.assert(parsedArgv['$0']);
  });

  s.test("has --config option", t => {
    let { configFilePath } = parseArgv(buildArgv('--config', 'myconfig.js'));
    t.equal(configFilePath, 'myconfig.js');
  });

  s.test("has --seed option", t => {
    let { runtimeConfig } = parseArgv(buildArgv('--seed', '51246'));
    t.equal(runtimeConfig.seed, 51246);
  });

  s.test("has --order option", t => {
    let { runtimeConfig } = parseArgv(buildArgv('--order', 'defined'));
    t.equal(runtimeConfig.order, ORDER_TYPES.defined);
  });

  s.test("has --tags option", t => {
    let { runtimeConfig } = parseArgv(buildArgv('--tags', 'api'));
    t.same(runtimeConfig.onlyIncludeTags, { api: true });
  });

  s.test("supports type=api tag format", t => {
    let { runtimeConfig } = parseArgv(buildArgv('--tags', 'type=api'));
    t.same(runtimeConfig.onlyIncludeTags, { type: 'api' });
  });

  s.test("has --excludeTags option", t => {
    let { runtimeConfig } = parseArgv(buildArgv('--excludeTags', 'api'));
    t.same(runtimeConfig.excludeTags, { api: true });
  });
});
