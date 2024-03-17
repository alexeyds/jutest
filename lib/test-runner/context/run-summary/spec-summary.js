import { pick } from "utils/object";
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
      lineNumber: sourceLocator.lineNumber
    };

    if (spec.isASuite) {
      this.type = SpecTypes.Suite;
    } else {
      this.type = SpecTypes.Test;
      this.executionResult = spec.result;
    }
  }
}
