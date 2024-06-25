import { jutest } from "jutest";
import { Test, TestContext } from "core";
import { spy } from "sinon";

function createTest(body, context) {
  context = context || new TestContext();
  return new Test('generic test', body, { context });
}

jutest("Test", s => {
  s.setup(() => {
    return { context: new TestContext() };
  });

  s.describe("#constructor", s => {
    s.test("sets initial attributes", (t, { context }) => {
      let test = new Test('foobar', () => {}, { context });

      t.assert(test.sourceLocator);
      t.equal(test.ownName, 'foobar');
      t.equal(test.isASuite, false);
      t.assert(test.contextId);
      t.equal(test.runTime, 0);
      t.same(test.parentContextIds, [context.id]);
      t.assert(test.tags);
      t.equal(test.skipped, false);
    });

    s.test("marks test as skipped if test body is not a function", (t, { context }) => {
      let test = new Test('foobar', {}, { context });

      t.equal(test.skipped, true);
      t.equal(test.result.status, Test.ExecutionStatuses.Skipped);
      t.match(test.result.skipReason, /implemented/);
    });

    s.test("adds default name to unnamed tests", (t, { context }) => {
      let test = new Test(undefined, undefined, { context });
      t.equal(test.name, '(unnamed)');
    });

    s.test("accepts sourceFilePath", (t, { context }) => {
      let ownFileName = 'test.test.js';
      let { sourceLocator } = new Test('foobar', () => {}, { context, sourceFilePath: ownFileName });

      t.equal(sourceLocator.sourceFilePath, ownFileName);
      t.assert(sourceLocator.lineNumber);
    });

    s.test("copies provided context", (t, { context }) => {
      let test = new Test('foobar', () => {}, { context });
      context.addName("test");
      context.addTags({ a: 1 });

      t.equal(test.name, 'foobar');
      t.equal(test.tags.a, undefined);
    });

    s.test("accepts tags", (t, { context }) => {
      let test = new Test('foobar', () => {}, { context, tags: { a: 1 } });
      t.equal(test.tags.a, 1);
    });
  });

  s.describe("#run", s => {
    s.test("runs test body", async (t) => {
      let test = createTest(t => t.equal(1,1));
      let result = await test.run();

      t.equal(result.status, Test.ExecutionStatuses.Passed);
      t.equal(test.wasRun, true);
      t.equal(test.result, result);
      t.assert(test.runTime);
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

    s.test("returns skipped result if test is skipped", async (t, { context }) => {
      let body = spy();
      let test = new Test('test', body, { context, skip: true });

      let result = await test.run();
      t.equal(body.called, false);
      t.assert(result.skipReason);
      t.equal(test.runTime, 0);
    });
  });

  s.describe('#name', s => {
    s.test("returns own name joined with context's name", (t, { context }) => {
      context.addName("foo");
      let test = new Test('bar', () => {}, { context });

      t.equal(test.name, 'foo bar');
    });
  });

  s.describe("with skip: true", s => {
    s.test("marks test as skipped and includes proper result", (t, { context }) => {
      let body = spy();
      let test = new Test('test', body, { context, skip: true });
      let { result } = test;

      t.equal(test.skipped, true);
      t.equal(result.status, Test.ExecutionStatuses.Skipped);
      t.match(result.skipReason, /xtest/);
      t.equal(body.called, false);
      t.equal(test.wasRun, false);
    });
  });
});
