import { jutest } from "jutest";
import { SpecsContainer, TestContext, TestSuite, Test } from "core";

jutest("SpecsContainer", s => {
  s.setup(() => {
    let context = new TestContext();
    let specsContainer = new SpecsContainer({ TestSuite });
    let builderAPI = specsContainer.toBuilderAPI({
      Test,
      TestSuite,
      context,
    });

    return { 
      specsContainer,
      context,
      builderAPI,
    };
  });

  s.describe("#constructor", s => {
    s.test("sets default attributes", (t, { specsContainer }) => {
      t.same(specsContainer.specs, []);
    });
  });

  s.describe("toBuilderAPI", s => {
    s.test("provides #test method", (t, { specsContainer, builderAPI }) => {
      builderAPI.test('some test', () => {});
      let test = specsContainer.specs[0];

      t.equal(test.name, 'some test');
    });

    s.test("provides #describe method", (t, { specsContainer, builderAPI }) => {
      builderAPI.describe('some suite', () => {});
      let suite = specsContainer.specs[0];

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

  s.describe("#composeAll", s => {
    s.test("sets default attributes", async (t, { specsContainer, builderAPI }) => {
      builderAPI.describe('my suite', (s) => {
        s.test('test', () => {});
      });

      await specsContainer.composeAll();

      t.equal(specsContainer.specs[0].specs.length, 1);
    });
  });
});
