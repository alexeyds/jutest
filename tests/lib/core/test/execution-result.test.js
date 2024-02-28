import { jutest } from "jutest";
import { ExecutionResult } from "core/test/execution-result";
import { ExecutionStatuses } from "core/test/execution-statuses";

jutest("ExecutionResult", s => {
  s.describe("::passed", s => {
    s.test("returns passed test result", t => {
      let result = ExecutionResult.passed();

      t.equal(result.status, ExecutionStatuses.Passed);
      t.equal(result.error, null);
      t.equal(result.teardownError, null);
      t.equal(result.skipReason, null);
    });
  });

  s.describe("::failed", s => {
    s.test("returns failed test result", t => {
      let result = ExecutionResult.failed('some error');

      t.equal(result.status, ExecutionStatuses.Failed);
      t.equal(result.error, 'some error');
      t.equal(result.teardownError, null);
      t.equal(result.skipReason, null);
    });
  });

  s.describe("::skipped", s => {
    s.test("returns failed test result", t => {
      let result = ExecutionResult.skipped('not implemented');

      t.equal(result.status, ExecutionStatuses.Skipped);
      t.equal(result.error, null);
      t.equal(result.teardownError, null);
      t.equal(result.skipReason, 'not implemented');
    });
  });

  s.describe("#addTeardownError", s => {
    s.test("converts tests into a failure with teardown error", t => {
      let result = ExecutionResult.passed();
      result.addTeardownError('error');

      t.equal(result.status, ExecutionStatuses.Failed);
      t.equal(result.error, null);
      t.equal(result.teardownError, 'error');
      t.equal(result.skipReason, null);
    });
  });

  s.describe("#toObject", s => {
    s.test("converts execution result to object", t => {
      let result = ExecutionResult.failed('some error').toObject();
      let keys = Object.keys(result);

      t.assert(keys.includes('status', 'error', 'teardownError', 'skipReason'));
    });
  });
});
