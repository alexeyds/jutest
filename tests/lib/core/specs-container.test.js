import { jutest } from "jutest";
import { SpecsContainer, TestContext } from "core";

jutest("SpecsContainer", s => {
  s.setup(() => {
    return { 
      testContainer: new SpecsContainer(),
      context: new TestContext(),
    };
  });

  s.describe("#constructor", s => {
    s.test("sets default attributes", (t, { testContainer }) => {
      t.same(testContainer.specs, []);
      t.equal(testContainer.isLocked, false);
    });
  });

  s.describe("#addTest", s => {
    s.test("adds test to the container", (t, { testContainer, context }) => {
      testContainer.addTest('some test', () => {}, { context });
      let test = testContainer.specs[0];

      t.equal(test.name, 'some test');
    });
  });

  s.describe("#addSuite", s => {
    s.test("adds test to the container", (t, { testContainer, context }) => {
      testContainer.addSuite('some suite', () => {}, { context });
      let suite = testContainer.specs[0];

      t.equal(suite.name, 'some suite');
      t.equal(suite.isASuite, true);
    });
  });

  s.describe("#lock", s => {
    s.test("prevents adding more tests to the container", (t, { testContainer, context }) => {
      testContainer.lock();

      t.throws(() => {
        testContainer.addTest('some test', () => {}, { context });
      }, /some test/);
      t.equal(testContainer.isLocked, true);
    });

    s.test("prevents adding more suites to the container", (t, { testContainer, context }) => {
      testContainer.lock();

      t.throws(() => {
        testContainer.addSuite('some suite', () => {}, { context });
      }, /some suite/);
    });
  });

  s.describe("#composeAll", s => {
    s.test("sets default attributes", async (t, { testContainer, context }) => {
      testContainer.addSuite('my suite', (s) => {
        s.test('test', () => {});
      }, { context });

      await testContainer.composeAll();

      t.equal(testContainer.specs[0].specs.length, 1);
    });
  });
});
