import { jutest } from "jutest";
import { SpecsContainer, TestContext } from "core";

jutest("SpecsContainer", s => {
  s.setup(() => {
    let context = new TestContext();
    let specsContainer = new SpecsContainer();
    let builderAPI = specsContainer.toBuilderAPI({ context });

    return { 
      specsContainer,
      context,
      builderAPI,
    };
  });

  s.describe("#constructor", s => {
    s.test("sets default attributes", (t, { specsContainer }) => {
      let specs = specsContainer.specs;
      t.same(specs, []);
    });
  });

  s.describe("toBuilderAPI", s => {
    s.test("provides #test method", (t, { specsContainer, builderAPI }) => {
      builderAPI.test('some test', () => {});
      let [test] = specsContainer.specs;

      t.equal(test.name, 'some test');
    });

    s.test("provides #describe method", (t, { specsContainer, builderAPI }) => {
      builderAPI.describe('some suite', () => {});
      let [suite] = specsContainer.specs;

      t.equal(suite.name, 'some suite');
      t.equal(suite.isASuite, true);
    });
  });

  s.describe("#lock", s => {
    s.test("prevents adding more tests to the container", (t, { specsContainer, builderAPI }) => {
      specsContainer.lock('my error');

      t.throws(() => {
        builderAPI.test('some test', () => {});
      }, /my error/);
    });

    s.test("prevents adding more suites to the container", (t, { specsContainer, builderAPI }) => {
      specsContainer.lock('my error');

      t.throws(() => {
        builderAPI.describe('some suite', () => {});
      }, /my error/);
    });
  });
});
