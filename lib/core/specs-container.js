import { Lock } from "utils/lock";

export class SpecsContainer {
  constructor() {
    this.specs = [];
    this._lock = new Lock();
  }

  lock(...args) {
    this._lock.lock(...args);
  }

  toBuilderAPI({ Test, TestSuite, context }) {
    return {
      describe: (name, body) => {
        this._addSpec(new TestSuite(name, body, { context }));
      },
      test: (name, body) => {
        this._addSpec(new Test(name, body, { context }));
      }
    };
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
