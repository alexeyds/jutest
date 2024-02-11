import { jutest } from "jutest";
import { SpecsContainer, TestContext, TestSuite } from "core";

jutest("SpecsContainer", s => {
  s.setup(() => {
    return { 
      specsContainer: new SpecsContainer({ TestSuite }),
      context: new TestContext(),
    };
  });

  s.describe("#constructor", s => {
    s.test("sets default attributes", (t, { specsContainer }) => {
      t.same(specsContainer.specs, []);
    });
  });

  s.describe("#addTest", s => {
    s.test("adds test to the container", (t, { specsContainer, context }) => {
      specsContainer.addTest('some test', () => {}, { context });
      let test = specsContainer.specs[0];

      t.equal(test.name, 'some test');
    });
  });

  s.describe("#addSuite", s => {
    s.test("adds test to the container", (t, { specsContainer, context }) => {
      specsContainer.addSuite('some suite', () => {}, { context });
      let suite = specsContainer.specs[0];

      t.equal(suite.name, 'some suite');
      t.equal(suite.isASuite, true);
    });
  });

  s.describe("#lock", s => {
    s.test("prevents adding more tests to the container", (t, { specsContainer, context }) => {
      specsContainer.lock('my error');

      t.throws(() => {
        specsContainer.addTest('some test', () => {}, { context });
      }, /my error/);
    });

    s.test("prevents adding more suites to the container", (t, { specsContainer, context }) => {
      specsContainer.lock('my error');

      t.throws(() => {
        specsContainer.addSuite('some suite', () => {}, { context });
      }, /my error/);
    });
  });

  s.describe("#composeAll", s => {
    s.test("sets default attributes", async (t, { specsContainer, context }) => {
      specsContainer.addSuite('my suite', (s) => {
        s.test('test', () => {});
      }, { context });

      await specsContainer.composeAll();

      t.equal(specsContainer.specs[0].specs.length, 1);
    });
  });
});
