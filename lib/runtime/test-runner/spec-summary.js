import { pick } from "utils/object";
import { SpecTypes, TestStatuses } from "./enums";

export class SpecSummary {
  constructor(spec) {
    Object.assign(this, pick(spec, [
      'name',
      'ownName',
      'contextId',
      'parentContextIds',
    ]));

    if (spec.isASuite) {
      this.type = SpecTypes.Suite;
    } else {
      this.type = SpecTypes.Test;
      this.executionResult = parseExecutionResult(spec);
    }
  }
}

function parseExecutionResult(test) {
  let { result } = test;

  if (result) {
    return {
      status: result.passed ? TestStatuses.Passed : TestStatuses.Failed,
      error: result.error,
      teardownError: result.teardownError,
    };
  } else if (test.skipped) {
    return {
      status: TestStatuses.Skipped,
      error: null,
      teardownError: null,
    };
  } else {
    return null;
  }
}
