import chalk from 'chalk';
import { Test } from "core";

export class ProgressReporter {
  constructor() {
    this._allTests = [];
    this._skippedTests = [];
    this.config = null;
  }

  reportTestResult(testSummary) {
    let { executionResult } = testSummary;

    if (executionResult.status === Test.ExecutionStatuses.Passed) {
      process.stderr.write(chalk.green('.'));
    } else if (executionResult.status === Test.ExecutionStatuses.Skipped) {
      this._skippedTests.push(testSummary);
      process.stderr.write(chalk.yellow('.'));
    } else {
      process.stderr.write(chalk.red('F'));
    }
  }

  async finishReporting() {
    process.stderr.write("\n");
  }
}
