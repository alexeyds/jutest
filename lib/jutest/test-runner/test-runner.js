import { Test } from "core/test";
import { TestSuite } from "core/test-suite";

export class TestRunner {
  constructor() {
    this._testsAndSuites = [];
  }

  addSuite(...args) {
    let suite = new TestSuite(...args);
    this._testsAndSuites.push(suite);
  }

  addTest(...args) {
    let test = new Test(...args);
    this._testsAndSuites.push(test);
  }

  async run(reporter) {
    await this._loadSuites();
    let allTestsPassed = await this._runTestsAndSuites(this._testsAndSuites, reporter);
    await reporter.reportSummary();

    return { allTestsPassed };
  }

  async _loadSuites() {
    for (let testOrSuite of this._testsAndSuites) {
      if (testOrSuite.isASuite) {
        await testOrSuite.compose();
      }
    }
  }

  async _runTestsAndSuites(testsAndSuites, reporter) {
    let success = true;

    for (let testOrSuite of testsAndSuites) {
      let intermediateSuccess = await this._runTestOrSuite(testOrSuite, reporter);
      if (!intermediateSuccess) success = false;
    }

    return success;
  }

  async _runTestOrSuite(testOrSuite, reporter) {
    if (testOrSuite.isASuite) {
      return this._runTestsAndSuites(testOrSuite.testsAndSuites, reporter);
    } else {
      return this._runTest(testOrSuite, reporter);
    }
  }

  async _runTest(test, reporter) {
    let result = await test.run();
    reporter.reportCompletedTest(test);
    return result.passed;
  }
}
