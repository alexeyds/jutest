export class SuiteBuilder {
  constructor(suite) {
    this._suite = suite;
    this._testsAndSuites = [];
  }

  async composeTests() {
    let result = [];

    for (let testOrSuite of this._testsAndSuites) {
      if (isASuite(testOrSuite)) {
        let tests = await testOrSuite.composeTests();
        result.push(...tests);
      } else {
        result.push(testOrSuite);
      }
    }

    return result;
  }

  addTest(...args) {
    let test = this._suite.createTest(...args);
    this._testsAndSuites.push(test);
  }

  addSuite(...args) {
    let suite = this._suite.createSuite(...args);
    this._testsAndSuites.push(suite);
  }
}

function isASuite(item) {
  return !!item.composeTests;
}
