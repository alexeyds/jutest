import { jutest } from "jutest";
import { SpecsContainer, Test } from "core";
import { SpecTypes } from "runtime/enums";
import { SpecSummary } from "runtime/test-runner/spec-summary";

jutest("SpecSummary", s => {
  s.setup(() => {
    let specsContainer = new SpecsContainer();
    return { specsContainer };
  });

  s.describe("constructor", s => {
    s.test("creates summary for a new test", (t, { specsContainer }) => {
      specsContainer.test('my test', () => {});
      let [test] = specsContainer.specs;
      let summary = new SpecSummary(test);

      t.equal(summary.type, SpecTypes.Test);
      t.equal(summary.name, 'my test');
      t.equal(summary.ownName, 'my test');
      t.refute(summary.executionResult);
      t.assert(summary.contextId);
      t.same(summary.parentContextIds, []);
    });

    s.test("creates summary for a suite", (t, { specsContainer }) => {
      specsContainer.describe('my suite', () => {});
      let [suite] = specsContainer.specs;
      let summary = new SpecSummary(suite);

      t.equal(summary.type, SpecTypes.Suite);
      t.equal(summary.name, 'my suite');
      t.equal(summary.ownName, 'my suite');
      t.equal(summary.executionResult, undefined);
      t.assert(summary.contextId);
      t.assert(summary.parentContextIds);
    });

    s.test("includes execution result for tests", async (t, { specsContainer }) => {
      specsContainer.test('my test', () => {});
      let [test] = specsContainer.specs;
      await test.run();

      let { executionResult } = new SpecSummary(test);
      t.equal(executionResult.status, Test.ExecutionStatuses.Passed);
      t.equal(executionResult.error, null);
      t.equal(executionResult.teardownError, null);
    });
  });
});
