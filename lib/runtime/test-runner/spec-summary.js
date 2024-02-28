import { pick } from "utils/object";
import { SpecTypes } from "./enums";

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
      this.executionResult = spec.result;
    }
  }
}
