import { inspect } from "util";
import chalk from 'chalk';
import { AssertionFailedError } from 'assertions/assertion';
import { addPadding, section, joinLines } from "reporters/formatting";

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
    if (this._failedTests.length > 0) {
      process.stdout.write(section('Failures'));

      this._failedTests.forEach((test, i) => {
        let errorDetails = addPadding(presentFailedTest(test, i+1), 2);
        process.stdout.write(section(errorDetails));
      });
    }

    let color = this._failedTests.length > 0 ? chalk.red : chalk.green;
    process.stdout.write(color(section(`Total: ${this._allTests.length}, Failed: ${this._failedTests.length}\n`)));
  }
}

function presentFailedTest(test, number) {
  let testName = `${number}) ${test.testName}`;
  let errorDescription = section(addPadding(getErrorDescription(test.error), 4));

  return testName + errorDescription;
}

function getErrorDescription(error) {
  if (error instanceof AssertionFailedError) {
    return presentAssertionError(error);
  } else {
    return presentRuntimeError(error);
  }
}

function presentAssertionError(error) {
  return joinLines(chalk.red(error.message), formatErrorStack(error));
}

function presentRuntimeError(error) {
  if (error instanceof Error) {
    return joinLines(chalk.red(`${error.name}: ${error.message}`), formatErrorStack(error));
  } else {
    return joinLines(chalk.red(`Error: ${inspect(error)}`), chalk.cyan('    (no stack trace)'));
  }
}

function formatErrorStack(error) {
  return error.stack
    .replace(error.message, "")
    .split('\n')
    .slice(1)
    .map(line => chalk.cyan(line))
    .join('\n');
}
