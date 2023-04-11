import jutest from "jutest";
import { TestContext } from "test-context";
import { Test } from "test";

function createTest(body, context) {
  context = context || new TestContext();
  return new Test('generic test', body, { context });
}

jutest("Test", s => {
  s.setup(() => {
    return { context: new TestContext() };
  });

  s.describe("#run", s => {
    s.test("runs test body", async (t) => {
      let test = createTest(t => t.equal(1,1));
      let result = await test.run();

      t.equal(result.passed, true);
    });
  });

  s.describe("#ownName", s => {
    s.test("returns name passed to the test", (t, { context }) => {
      let test = new Test('foobar', () => {}, { context });
      t.equal(test.ownName, 'foobar');
    });
  });

  s.describe('#name', s => {
    s.test("returns name with context", (t, { context }) => {
      context.addName("foo");
      let test = new Test('bar', () => {}, { context });

      t.equal(test.name, 'foo bar');
    });
  });
});
