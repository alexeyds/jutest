import { pick } from "utils/object";
import { Test } from "core";
import { TestRunnerEnums } from "test-runner/enums";

let { SpecTypes } = TestRunnerEnums;

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
      this.testsCount = spec.testsCount;
    } else {
      this.type = SpecTypes.Test;
      this.runTime = spec.runTime;
      this.executionResult = spec.result;

      if (spec.result?.status === Test.ExecutionStatuses.Failed) {
        this.definitionLocation = definitionLocation(spec);
      }
    }
  }
}

function definitionLocation(spec) {
  let { sourceLocator } = spec;

  return {
    file: sourceLocator.sourceFilePath,
    lineNumber: sourceLocator.lineNumber
  };
}
