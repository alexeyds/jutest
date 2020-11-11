export default class TestResults {
  constructor({onSingleTestResult}={}) {
    this._results = [];
    this._onSingleTestResult = onSingleTestResult;
  }

  get all() {
    return this._results;
  }

  addTestResult(testResult) {
    this._results.push(testResult);

    if (this._onSingleTestResult) {
      this._onSingleTestResult(testResult);
    }
  }
}