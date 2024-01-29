import { jutest } from "jutest";
import { TestsContainer } from "test-runner/tests-container";
import { TestContext } from "core/test-context";

jutest("TestsContainer", s => {
  s.setup(() => {
    return { 
      testContainer: new TestsContainer(),
      context: new TestContext(),
    }
  })

  s.describe("#constructor", s => {
    s.test("sets default attributes", (t, { testContainer }) => {
      t.same(testContainer.testsAndSuites, []);
      t.equal(testContainer.isLocked, false);
    });
  });

  s.describe("#addTest", s => {
    s.test("adds test to the container", (t, { testContainer, context }) => {
      testContainer.addTest('some test', () => {}, { context });
      let test = testContainer.testsAndSuites[0];

      t.equal(test.name, 'some test');
    });
  });

  s.describe("#addSuite", s => {
    s.test("adds test to the container", (t, { testContainer, context }) => {
      testContainer.addSuite('some suite', () => {}, { context });
      let suite = testContainer.testsAndSuites[0];

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
});
