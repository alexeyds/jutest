import { jutest } from "jutest";
import { Test, TestSuite, TestContext } from "core";
import { SpecTypes, TestStatuses } from "runtime/test-runner/enums";
import { SpecSummary } from "runtime/test-runner/spec-summary";

function createTest(...args) {
  let context = new TestContext();
  return new Test(...args, { context });
}

function createSuite(...args) {
  let context = new TestContext();
  return new TestSuite(...args, { context });
}

jutest("SpecSummary", s => {
  s.describe("constructor", s => {
    s.test("creates summary for a new test", t => {
      let test = createTest('my test', () => {});
      let summary = new SpecSummary(test);

      t.equal(summary.type, SpecTypes.Test);
      t.equal(summary.name, 'my test');
      t.equal(summary.ownName, 'my test');
      t.equal(summary.executionResult, null);
      t.assert(summary.contextId);
      t.same(summary.parentContextIds, []);
    });

    s.test("creates summary for a suite", t => {
      let suite = createSuite('my suite', () => {});
      let summary = new SpecSummary(suite);

      t.equal(summary.type, SpecTypes.Suite);
      t.equal(summary.name, 'my suite');
      t.equal(summary.ownName, 'my suite');
      t.equal(summary.executionResult, undefined);
      t.assert(summary.contextId);
      t.assert(summary.parentContextIds);
    });

    s.test("includes execution result for passed tests", async t => {
      let test = createTest('my test', () => {});
      await test.run();

      let { executionResult } = new SpecSummary(test);
      t.equal(executionResult.status, TestStatuses.Passed);
      t.equal(executionResult.error, null);
      t.equal(executionResult.teardownError, null);
    });

    s.test("includes execution result for failed tests", async t => {
      let test = createTest('my test', t => { t.fail('foo') });
      await test.run();

      let { executionResult } = new SpecSummary(test);
      t.equal(executionResult.status, TestStatuses.Failed);
      t.match(executionResult.error, /foo/);
      t.equal(executionResult.teardownError, null);
    });

    s.test("includes teardown result for failed tests", async t => {
      let context = new TestContext();
      context.addTeardown(() => { throw '123' });
      let test = new Test('my test', () => {}, { context });
      await test.run();

      let { executionResult } = new SpecSummary(test);
      t.equal(executionResult.status, TestStatuses.Failed);
      t.match(executionResult.error, null);
      t.match(executionResult.teardownError, /123/);
    });
  });
});
