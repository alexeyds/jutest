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
    let result = { success: true };
    await this._loadSuites();

    for (let testOrSuite of this._testsAndSuites) {
      let tests = testOrSuite.isASuite ? testOrSuite.tests : [testOrSuite];
      let { success } = await this._runTests(tests, reporter);
      if (!success) result.success = false;
    }

    await reporter.reportSummary();

    return result;
  }

  async _loadSuites() {
    for (let testOrSuite of this._testsAndSuites) {
      if (testOrSuite.isASuite) {
        await testOrSuite.composeTests();
      }
    }
  }

  async _runTests(tests, reporter) {
    let result = { success: true };

    for (let test of tests) {
      await test.run();
      if (!test.result.passed) result.success = false;
      reporter.reportCompletedTest(test);
    }

    return result;
  }
}
