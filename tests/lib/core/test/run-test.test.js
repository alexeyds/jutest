import { jutest } from "jutest";
import { TestContext } from "core/test-context";
import { runTest as rawRunTest } from "core/test/run-test";
import { ExecutionStatuses } from "core/test/execution-statuses";
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
      t.equal(result.status, ExecutionStatuses.Passed);
      t.refute(result.error);
    });

    s.test("passes assertions to test body", async t => {
      let result = await runTest(t => t.equal(1, 1));
      t.equal(result.status, ExecutionStatuses.Passed);
    });

    s.test("handles errors", async t => {
      let result = await runTest(t => t.equal(1, 2));

      t.equal(result.status, ExecutionStatuses.Failed);
      t.match(result.error, /equal/);
    });

    s.test("works with async tests", async t => {
      let result = await runTest(async t => t.equal(1, 2));
      t.equal(result.status, ExecutionStatuses.Failed);
    });
  });

  s.describe("setup", s => {
    s.test("runs setups before test", async (t, { context }) => {
      let setup = spy();
      context.setup(setup);
      let testBody = spy();
      await runTest(testBody, context);

      t.assert(setup.calledBefore(testBody));
    });

    s.test("passes resulting assigns to the test", async (t, { context }) => {
      context.setup(() => ({ a: 1 }));
      let assigns;
      await runTest((t, a) => assigns = a, context);

      t.same(assigns, { a: 1 });
    });
  });

  s.describe("before test assertions", s => {
    s.test("runs assertion before test", async (t, { context }) => {
      let assertionBody = spy();
      context.assertBeforeTest(assertionBody);
      let testBody = spy();
      await runTest(testBody, context);

      t.assert(assertionBody.calledBefore(testBody));
    });

    s.test("passes assertions to assertion body", async (t, { context }) => {
      context.assertBeforeTest(t => t.equal(1, 1));
      let result = await runTest(() => {}, context);

      t.equal(result.status, ExecutionStatuses.Passed);
    });

    s.test("passes assigns to assertion body", async (t, { context }) => {
      context.setup(() => ({ a: 1 }));
      let assigns;
      context.assertBeforeTest((t, a) => assigns = a);
      await runTest(() => {}, context);

      t.same(assigns, { a: 1});
    });
  });

  s.describe("after test assertions", s => {
    s.test("runs assertion before test", async (t, { context }) => {
      let assertionBody = spy();
      context.assertAfterTest(assertionBody);
      let testBody = spy();
      await runTest(testBody, context);

      t.assert(assertionBody.calledAfter(testBody));
    });

    s.test("passes assertions to assertion body", async (t, { context }) => {
      context.assertAfterTest(t => t.equal(1, 1));
      let result = await runTest(() => {}, context);

      t.equal(result.status, ExecutionStatuses.Passed);
    });

    s.test("passes assigns to assertion body", async (t, { context }) => {
      context.setup(() => ({ a: 1 }));
      let assigns;
      context.assertAfterTest((t, a) => assigns = a);
      await runTest(() => {}, context);

      t.same(assigns, { a: 1});
    });
  });

  s.describe("teardowns", s => {
    s.test("runs teardowns after  the test is done", async (t, { context }) => {
      let teardown = spy();
      let assertion = spy();
      let testBody = spy();

      context.assertAfterTest(assertion);
      context.teardown(teardown);
      await runTest(testBody, context);

      t.assert(teardown.calledAfter(testBody));
      t.assert(teardown.calledAfter(assertion));
    });

    s.test("passes assigns to teardowns", async (t, { context }) => {
      context.setup(() => ({ a: 1 }));
      let assigns;
      context.teardown((a) => assigns = a);
      await runTest(() => {}, context);

      t.same(assigns, { a: 1});
    });

    s.test("passes tags to teardowns", async (t, { context }) => {
      let tags;
      context.teardown((_, t) => tags = t);
      context.addTags({ a: 1 });
      await runTest(() => {}, context);

      t.equal(tags.a, 1);
    });
  });
});
