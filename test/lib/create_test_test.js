import jutest from "jutest";
import TestSetup from "test_setup";
import createTest from "create_test";

jutest("createTest()", s => {
  s.describe("testSetup", s => {
    s.test("runs setup callbacks and passes assigns to test", async t => {
      let testSetup = new TestSetup();
      testSetup.setup(() => ({a: 1}));

      let assigns;
      let runTest = createTest({
        testBody: (_t, a) => assigns = a,
        testSetup
      });
      await runTest();

      t.same(assigns, {a: 1});
    });

    s.test("runs teardown callbacks after the test", async t => {
      let wasRun = false;
      let testSetup = new TestSetup();
      testSetup.teardown(() => (wasRun = true));

      let runTest = createTest({
        testBody: () => { wasRun = false; },
        testSetup
      });
      await runTest();

      t.equal(wasRun, true);
    });

    s.test("runs beforeTestEnd callbacks", async t => {
      let testSetup = new TestSetup();
      testSetup.setup(() => ({foo: 'bar'}));
      testSetup.beforeTestEnd((t, assigns) => t.same(assigns, {}));

      let runTest = createTest({
        testBody: () => {},
        testSetup
      });
      let result = await runTest();

      t.equal(result.passed, false);
    });
  });
});
