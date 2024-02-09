import { Test } from "core/test";
import { TestSuite } from "core/test-suite";

export class SpecsContainer {
  constructor() {
    this.specs = [];
    this.isLocked = false;
  }

  addTest(...args) {
    this._addSpec(new Test(...args));
  }

  addSuite(...args) {
    this._addSpec(new TestSuite(...args));
  }

  lock() {
    this.isLocked = true;
  }

  async composeAll() {
    for (let spec of this.specs) {
      if (spec.isASuite) {
        await spec.compose();
      }
    }
  }

  _addSpec(spec) {
    this._maybeRaiseContainerLockedError(spec);
    this.specs.push(spec);
  }

  _maybeRaiseContainerLockedError(spec) {
    const name = `${spec.name} ${spec.isASuite ? 'suite' : 'test'}`;

    if (this.isLocked) {
      throw new Error(
        `Attempted to register "${name}" after all the test files were already loaded. ` + 
        `Registering tests/suites asynchronously or through dynamic imports is not supported.`
      );
    }
  }
}
