import { jutest } from "jutest";
import { Jutest } from "core";

jutest("Jutest", s => {
  s.setup(() => {
    let jutestInstance = new Jutest();
    return { jutestInstance };
  });

  s.describe("#constructor", s => {
    s.test("sets default attributes", (t, { jutestInstance }) => {
      t.same(jutestInstance.specs, []);
    });
  });

  s.describe("#configureNewInstance", s => {
    s.test("returns new instance", (t, { jutestInstance }) => {
      let jutest2 = jutestInstance.configureNewInstance();

      t.assert(jutest2.api);
      t.assert(jutest2.specsContainer);
    });

    s.test("shares specs between instances", (t, { jutestInstance }) => {
      let jutest2 = jutestInstance.configureNewInstance();
      jutestInstance.api.test('foo');

      t.equal(jutest2.specs[0].name, 'foo');
    });

    s.test("accepts configuration function", (t, { jutestInstance }) => {
      let jutest2 = jutestInstance.configureNewInstance(s => s.addName('foo'));
      jutest2.api.test('bar');

      t.equal(jutest2.specs[0].name, 'foo bar');
    });

    s.test("locks context after first configuration", (t, { jutestInstance }) => {
      let config;
      jutestInstance.configureNewInstance(c => config = c);

      t.throws(() => config.addName('test'), /configure/);
    });
  });

  s.describe("#toPublicAPI", s => {
    s.setup(({ jutestInstance }) => {
      let api = jutestInstance.toPublicAPI();
      return { api };
    });

    s.test("returns builder API", (t, { api, jutestInstance }) => {
      api.test('foo');

      t.equal(jutestInstance.specs[0].name, 'foo');
      t.assert(api.test);
      t.assert(api.describe);
      t.assert(api.xtest);
      t.assert(api.xdescribe);
      t.refute(api.specsContainer);
    });

    s.test("can act as a describe func", (t, { api, jutestInstance }) => {
      api('foo');
      let [suite] = jutestInstance.specs;

      t.equal(suite.name, 'foo');
      t.equal(suite.isASuite, true);
    });

    s.test("has configureNewInstance", (t, { api, jutestInstance }) => {
      let instanceAPI = api.configureNewInstance(s => s.addName('foo'));
      instanceAPI.test('bar');

      t.equal(jutestInstance.specs[0].name, 'foo bar');
    });

    s.test("configureNewInstance retrusn public API", (t, { api }) => {
      let instance = api.configureNewInstance();
      t.refute(instance.specsContainer);
    });
  });
});
