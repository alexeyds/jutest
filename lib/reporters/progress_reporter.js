import chalk from 'chalk';

export default class ProgressReporter {
  constructor() {
    this._allTests = [];
    this._failedTests = [];
  }

  reportTestResult(testResult) {
    this._allTests.push(testResult);

    if (testResult.passed) {
      process.stdout.write(chalk.green('.'));
    } else {
      this._failedTests.push(testResult);
      process.stdout.write(chalk.red('F'));
    }
  }

  reportSummary() {
    let color = this._failedTests.length > 0 ? chalk.red : chalk.green;

    console.log('\n');
    this._failedTests.forEach(t => {
      console.log(t.testName);
      console.log(t.error);
      console.log('\n');
    });
    console.log(color(`Total: ${this._allTests.length}, Failed: ${this._failedTests.length}`));
  }
}
