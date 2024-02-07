import { Test } from "core/test";
import { TestSuite } from "core/test-suite";

export class SpecsContainer {
  constructor() {
    this.testsAndSuites = [];
    this.isLocked = false;
  }

  addTest(...args) {
    this._addTestOrSuite(new Test(...args));
  }

  addSuite(...args) {
    this._addTestOrSuite(new TestSuite(...args));
  }

  lock() {
    this.isLocked = true;
  }

  _addTestOrSuite(testOrSuite) {
    this._maybeRaiseContainerLockedError(testOrSuite);
    this.testsAndSuites.push(testOrSuite);
  }

  _maybeRaiseContainerLockedError(testOrSuite) {
    const name = `${testOrSuite.name} ${testOrSuite.isASuite ? 'suite' : 'test'}`;

    if (this.isLocked) {
      throw new Error(
        `Attempted to register "${name}" after all the test files were already loaded. ` + 
        `Registering tests/suites asynchronously or through dynamic imports is not supported.`
      )
    }
  }
}
