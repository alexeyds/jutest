import { Test } from "core/test";
import { TestSuite } from "core/test-suite";
import { Lock } from "utils/lock";

export class SpecsContainer {
  constructor({ skip=false }={}) {
    this.specs = [];
    this._skip = skip;
    this._lock = new Lock();
  }

  lock(...args) {
    this._lock.lock(...args);
  }

  toBuilderAPI({ context }) {
    return {
      describe: this._createSuiteBuilder({ context, skip: this._skip }),
      test: this._createTestBuilder({ context, skip: this._skip }),
      xtest: this._createTestBuilder({ context, skip: true }),
      xdescribe: this._createSuiteBuilder({ context, skip: true }),
    };
  }

  _createTestBuilder(...args) {
    return this._createSpecBuilder(Test, ...args);
  }

  _createSuiteBuilder(...args) {
    return this._createSpecBuilder(TestSuite, ...args);
  }

  _createSpecBuilder(SpecClass, { context, skip }) {
    return (name, body) => {
      this._addSpec(new SpecClass(name, body, { context, skip }));
    };
  }

  _addSpec(spec) {
    this._lock.throwIfLocked();
    this.specs.push(spec);
  }
}
