import { jutest } from "jutest";
import { Jutest, Test } from "core";
import { TestRunnerEnums } from "test-runner";
import { SpecSummary } from "test-runner/context/run-summary/spec-summary";

const { SpecTypes } = TestRunnerEnums;

jutest("SpecSummary", s => {
  s.setup(() => {
    let jutestInstance = new Jutest();
    return { jutestInstance };
  });

  s.describe("constructor", s => {
    s.test("creates summary for a new test", (t, { jutestInstance }) => {
      let test = jutestInstance.specsContainer.test('my test', () => {});
      let summary = new SpecSummary(test);

      t.equal(summary.type, SpecTypes.Test);
      t.equal(summary.name, 'my test');
      t.equal(summary.ownName, 'my test');
      t.equal(summary.runTime, 0);
      t.assert(summary.contextId);
      t.assert(summary.definitionLocation);
      t.same(summary.parentContextIds, []);
      t.refute(summary.executionResult);
    });

    s.test("creates summary for a suite", (t, { jutestInstance }) => {
      let suite = jutestInstance.specsContainer.describe('my suite', () => {});
      let summary = new SpecSummary(suite);

      t.equal(summary.type, SpecTypes.Suite);
      t.equal(summary.name, 'my suite');
      t.equal(summary.ownName, 'my suite');
      t.equal(summary.testsCount, 0);
      t.assert(summary.contextId);
      t.assert(summary.parentContextIds);
      t.assert(summary.definitionLocation);
      t.refute(summary.executionResult);
    });

    s.test("includes execution result for tests", async (t, { jutestInstance }) => {
      let test = jutestInstance.specsContainer.test('my test', () => {});
      await test.run();

      let { executionResult } = new SpecSummary(test);
      t.equal(executionResult.status, Test.ExecutionStatuses.Passed);
      t.refute(executionResult.error);
      t.equal(executionResult.teardownError, null);
    });

    s.test("includes lineNumber for failed tests", async (t, { jutestInstance }) => {
      let test;

      await jutestInstance.specsContainer.withSourceFilePath('spec-summary.test.js', () => {
        test = jutestInstance.specsContainer.test('my test', (t) => t.assert(false));
      });

      await test.run();

      let { definitionLocation } = new SpecSummary(test);

      t.assert(definitionLocation);
      t.equal(definitionLocation.file, 'spec-summary.test.js');
      t.assert(definitionLocation.lineNumber);
    });
  });
});
