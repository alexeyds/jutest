import jutest from "jutest";
import TestSetup from "test_setup";
import createTest from "create_test";

jutest("createTest()", s => {
  s.describe("testSetup", s => {
    s.test("runs setups and passes the result to test", async t => {
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
  });
});
