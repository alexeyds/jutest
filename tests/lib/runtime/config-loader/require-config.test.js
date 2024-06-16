import { jutest } from "jutest";
import { spy } from "sinon";
import { resolveToCwd } from "utils/file";
import { requireConfig } from "runtime/config-loader/require-config";

jutest("requireConfig", s => {
  s.setup(() => {
    let requireFunc = (file) => ({ file });
    return { requireFunc };
  });

  s.test("requires file and returns the result", (t, { requireFunc }) => {
    let config = requireConfig({ filePath: 'config', requireFunc });
    t.same(config, { file: resolveToCwd('config') });
  });

  s.test("requires default config file", (t, { requireFunc }) => {
    let config = requireConfig({ requireFunc });
    t.same(config, { file: resolveToCwd('jutest.config') });
  });

  s.test("returns empty object if default config file not found", t => {
    let requireFunc = () => require('does-not-exist123');
    let config = requireConfig({ requireFunc });

    t.same(config, {});
  });

  s.test("re-throws any other errors", t => {
    let requireFunc = () => { throw '123' };
    t.throws(() => requireConfig({ requireFunc }), /123/);
  });

  s.test("throws an error if custom config file was not found", t => {
    let requireFunc = () => require('does-not-exist123');
    t.throws(() => requireConfig({ requireFunc, filePath: 'my-config' }), /module/);
  });
});
