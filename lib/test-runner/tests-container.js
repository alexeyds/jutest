import { Test } from "core/test";
import { TestSuite } from "core/test-suite";

export class TestsContainer {
  constructor() {
    this.testsAndSuites = [];
    this.isLocked = false;
  }

  addTest(...args) {
    let test = new Test(...args);
    this._maybeRaiseContainerLockedError(`"${test.name}" test`)
    this.testsAndSuites.push(test);
  }

  addSuite(...args) {
    let suite = new TestSuite(...args);
    this._maybeRaiseContainerLockedError(`"${suite.name}" suite`)
    this.testsAndSuites.push(suite);
  }

  lock() {
    this.isLocked = true;
  }

  _maybeRaiseContainerLockedError(testOrSuiteName) {
    if (this.isLocked) {
      throw new Error(
        `Attempted to register "${testOrSuiteName}" after all the test files were already loaded. ` + 
        `Registering tests/suites asynchronously or through dynamic imports is not supported.`
      )
    }
  }
}
