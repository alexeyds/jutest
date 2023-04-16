import jutest from "jutest";
import { TestContext } from "core/test-context";
import { runTest as rawRunTest } from "core/test/run-test";
import { spy } from "sinon";

function runTest(body, context) {
  context = context || new TestContext();
  return rawRunTest(body, context);
}

jutest("runTest", s => {
  s.setup(() => {
    return { context: new TestContext() };
  });

  s.describe("test body", s => {
    s.test("executes test body and returns result", async t => {
      let testBody = spy();
      let result = await runTest(testBody);

      t.assert(testBody.called);
      t.equal(result.passed, true);
      t.equal(result.error, null);
      t.equal(result.teardownError, null);
    });

    s.test("passes assertions to test body", async t => {
      let result = await runTest(t => t.equal(1, 1));
      t.equal(result.passed, true);
    });

    s.test("handles errors", async t => {
      let result = await runTest(t => t.equal(1, 2));

      t.equal(result.passed, false);
      t.match(result.error, /equal/);
    });

    s.test("works with async tests", async t => {
      let result = await runTest(async t => t.equal(1, 2));
      t.equal(result.passed, false);
    });
  });

  s.describe("setup", s => {
    s.test("runs setups before test", async (t, { context }) => {
      let setup = spy();
      context.addSetup(setup);
      let testBody = spy();
      await runTest(testBody, context);

      t.assert(setup.calledBefore(testBody));
    });

    s.test("passes resulting assigns to the test", async (t, { context }) => {
      context.addSetup(() => ({ a: 1 }));
      let assigns;
      await runTest((t, a) => assigns = a, context);

      t.same(assigns, { a: 1 });
    });
  });

  s.describe("before test assertions", s => {
    s.test("runs assertion before test", async (t, { context }) => {
      let assertionBody = spy();
      context.addBeforeTestAssertion(assertionBody);
      let testBody = spy();
      await runTest(testBody, context);

      t.assert(assertionBody.calledBefore(testBody));
    });

    s.test("passes assertions to assertion body", async (t, { context }) => {
      context.addBeforeTestAssertion(t => t.equal(1, 1));
      let result = await runTest(() => {}, context);

      t.equal(result.passed, true);
    });

    s.test("passes assigns to assertion body", async (t, { context }) => {
      context.addSetup(() => ({ a: 1 }));
      let assigns;
      context.addBeforeTestAssertion((t, a) => assigns = a);
      await runTest(() => {}, context);

      t.same(assigns, { a: 1});
    });
  });

  s.describe("after test assertions", s => {
    s.test("runs assertion before test", async (t, { context }) => {
      let assertionBody = spy();
      context.addAfterTestAssertion(assertionBody);
      let testBody = spy();
      await runTest(testBody, context);

      t.assert(assertionBody.calledAfter(testBody));
    });

    s.test("passes assertions to assertion body", async (t, { context }) => {
      context.addAfterTestAssertion(t => t.equal(1, 1));
      let result = await runTest(() => {}, context);

      t.equal(result.passed, true);
    });

    s.test("passes assigns to assertion body", async (t, { context }) => {
      context.addSetup(() => ({ a: 1 }));
      let assigns;
      context.addAfterTestAssertion((t, a) => assigns = a);
      await runTest(() => {}, context);

      t.same(assigns, { a: 1});
    });
  });

  s.describe("teardowns", s => {
    s.test("runs teardowns after  the test is done", async (t, { context }) => {
      let teardown = spy();
      let assertion = spy();
      let testBody = spy();

      context.addAfterTestAssertion(assertion);
      context.addTeardown(teardown);
      await runTest(testBody, context);

      t.assert(teardown.calledAfter(testBody));
      t.assert(teardown.calledAfter(assertion));
    });

    s.test("passes assigns to teardowns", async (t, { context }) => {
      context.addSetup(() => ({ a: 1 }));
      let assigns;
      context.addTeardown((a) => assigns = a);
      await runTest(() => {}, context);

      t.same(assigns, { a: 1});
    });

    s.test("handles teardown errors", async (t, { context }) => {
      context.addTeardown(() => { throw 'test'; });
      let result = await runTest(() => {}, context);

      t.equal(result.passed, false);
      t.equal(result.teardownError, 'test');
    });
  });
});
