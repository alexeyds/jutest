import { jutest } from "jutest";
import { Jutest, Test } from "core";
import { TestRunnerEnums } from "test-runner";
import { SpecSummary } from "test-runner/run-specs/spec-summary";

const { SpecTypes } = TestRunnerEnums;

jutest("SpecSummary", s => {
  s.setup(() => {
    let jutestInstance = new Jutest();
    return { jutestInstance };
  });

  s.describe("constructor", s => {
    s.test("creates summary for a new test", (t, { jutestInstance }) => {
      jutestInstance.test('my test', () => {});
      let [test] = jutestInstance.specs;
      let summary = new SpecSummary(test);

      t.equal(summary.type, SpecTypes.Test);
      t.equal(summary.name, 'my test');
      t.equal(summary.ownName, 'my test');
      t.refute(summary.executionResult);
      t.assert(summary.contextId);
      t.same(summary.parentContextIds, []);
    });

    s.test("creates summary for a suite", (t, { jutestInstance }) => {
      jutestInstance.describe('my suite', () => {});
      let [suite] = jutestInstance.specs;
      let summary = new SpecSummary(suite);

      t.equal(summary.type, SpecTypes.Suite);
      t.equal(summary.name, 'my suite');
      t.equal(summary.ownName, 'my suite');
      t.equal(summary.executionResult, undefined);
      t.assert(summary.contextId);
      t.assert(summary.parentContextIds);
    });

    s.test("includes execution result for tests", async (t, { jutestInstance }) => {
      jutestInstance.test('my test', () => {});
      let [test] = jutestInstance.specs;
      await test.run();

      let { executionResult } = new SpecSummary(test);
      t.equal(executionResult.status, Test.ExecutionStatuses.Passed);
      t.equal(executionResult.error, null);
      t.equal(executionResult.teardownError, null);
    });
  });
});
