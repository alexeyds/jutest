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

    let { sourceLocator } = spec;

    this.definitionLocation = {
      file: sourceLocator.sourceFilePath,
    };

    if (spec.isASuite) {
      this.type = SpecTypes.Suite;
      this.testsCount = spec.testsCount;
    } else {
      this.type = SpecTypes.Test;
      this.runTime = spec.runTime;
      this.executionResult = spec.result;

      if (spec.result?.status === Test.ExecutionStatuses.Failed) {
        this.definitionLocation.lineNumber = sourceLocator.lineNumber;
      }
    }
  }
}
