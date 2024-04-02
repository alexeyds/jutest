import { jutest } from "jutest";
import { ExecutionResult } from "core/test/execution-result";
import { ExecutionStatuses } from "core/test/execution-statuses";

jutest("ExecutionResult", s => {
  s.describe("::passed", s => {
    s.test("returns passed test result", t => {
      let result = ExecutionResult.passed();

      t.equal(result.status, ExecutionStatuses.Passed);
      t.refute(result.error);
      t.equal(result.skipReason, null);
    });
  });

  s.describe("::failed", s => {
    s.test("returns failed test result", t => {
      let result = ExecutionResult.failed('some error');

      t.equal(result.status, ExecutionStatuses.Failed);
      t.equal(result.error, 'some error');
      t.equal(result.skipReason, null);
    });
  });

  s.describe("::skipped", s => {
    s.test("returns failed test result", t => {
      let result = ExecutionResult.skipped('not implemented');

      t.equal(result.status, ExecutionStatuses.Skipped);
      t.refute(result.error);
      t.equal(result.skipReason, 'not implemented');
    });
  });

  s.describe("#toObject", s => {
    s.test("converts execution result to object", t => {
      let result = ExecutionResult.failed('some error').toObject();
      let keys = Object.keys(result);

      t.assert(keys.includes('status', 'error', 'skipReason'));
    });
  });
});
