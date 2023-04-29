import jutest from "jutest";
import { TestContext } from "core/test-context";
import { Test } from "core/test";
import { spy } from "sinon";

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
      t.equal(test.wasRun, true);
      t.equal(test.result, result);
    });

    s.test("doesn't bind test body to test instance", async t => {
      let testThis;
      let test = createTest(function() { testThis = this; });
      await test.run();

      t.notEqual(testThis, test);
    });

    s.test("doesn't run a test twice", async t => {
      let body = spy();
      let test = createTest(body);
      let promise1 = test.run();
      let promise2 = test.run();
      let [result1, result2] = await Promise.all([promise1, promise2]);

      t.equal(body.callCount, 1);
      t.equal(result1, result2);
    });
  });

  s.describe("#context", s => {
    s.test("returns context", (t, { context }) => {
      let test = createTest(() => {}, context);
      t.equal(test.context, context);
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

    s.test("dynamically generates test name", (t, { context }) => {
      let test = new Test('bar', () => {}, { context });
      context.addName("foo");

      t.equal(test.name, 'foo bar');
    });
  });
});
