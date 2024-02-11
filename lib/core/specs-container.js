import { Test } from "core/test";
import { Lock } from "utils/lock";

export class SpecsContainer {
  constructor({ TestSuite }) {
    this.specs = [];
    this._lock = new Lock();
    this._TestSuite = TestSuite;
  }

  addTest(...args) {
    this._addSpec(new Test(...args));
  }

  addSuite(...args) {
    this._addSpec(new this._TestSuite(...args));
  }

  lock(...args) {
    this._lock.lock(...args);
  }

  async composeAll() {
    for (let spec of this.specs) {
      if (spec.isASuite) {
        await spec.compose();
      }
    }
  }

  _addSpec(spec) {
    this._lock.throwIfLocked();
    this.specs.push(spec);
  }
}
