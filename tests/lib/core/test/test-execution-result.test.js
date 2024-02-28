import { jutest } from "jutest";
import { TestExecutionResult } from "core/test/test-execution-result";

const { Statuses } = TestExecutionResult;

jutest("TestExecutionResult", s => {
  s.describe("::passed", s => {
    s.test("returns passed test result", t => {
      let result = TestExecutionResult.passed();

      t.equal(result.status, Statuses.Passed);
      t.equal(result.error, null);
      t.equal(result.teardownError, null);
      t.equal(result.skipReason, null);
    });
  });

  s.describe("::failed", s => {
    s.test("returns failed test result", t => {
      let result = TestExecutionResult.failed('some error');

      t.equal(result.status, Statuses.Failed);
      t.equal(result.error, 'some error');
      t.equal(result.teardownError, null);
      t.equal(result.skipReason, null);
    });
  });

  s.describe("::skipped", s => {
    s.test("returns failed test result", t => {
      let result = TestExecutionResult.skipped('not implemented');

      t.equal(result.status, Statuses.Skipped);
      t.equal(result.error, null);
      t.equal(result.teardownError, null);
      t.equal(result.skipReason, 'not implemented');
    });
  });

  s.describe("#addTeardownError", s => {
    s.test("converts tests into a failure with teardown error", t => {
      let result = TestExecutionResult.passed();
      result.addTeardownError('error');

      t.equal(result.status, Statuses.Failed);
      t.equal(result.error, null);
      t.equal(result.teardownError, 'error');
      t.equal(result.skipReason, null);
    });
  });

  s.describe("#toObject", s => {
    s.test("converts execution result to object", t => {
      let result = TestExecutionResult.failed('some error').toObject();
      let keys = Object.keys(result);

      t.assert(keys.includes('status', 'error', 'teardownError', 'skipReason'));
    });
  });
});
