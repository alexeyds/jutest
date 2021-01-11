import { inspect } from "util";
import chalk from 'chalk';
import { AssertionFailedError } from 'assertions/assertion';
import { addPadding, joinLines, extractErrorStack } from "reporters/formatting";

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
      this._printSection('Failures:');

      this._failedTests.forEach((test, i) => {
        let errorDetails = addPadding(presentFailedTest(test, i+1), 2);
        this._printSection(errorDetails);
      });
    }

    let summary = `Total: ${this._allTests.length}, Failed: ${this._failedTests.length}\n`;
    let color = this._failedTests.length > 0 ? chalk.red : chalk.green;
    this._printSection(color(summary));
  }

  _printSection(text) {
    process.stdout.write('\n\n' + text);
  }
}

function presentFailedTest(test, number) {
  let testName = `${number}) ${test.testName}`;
  let errorDescription = addPadding(getErrorDescription(test.error), 4);

  return testName + '\n\n' + errorDescription;
}

function getErrorDescription(error) {
  if (error instanceof AssertionFailedError) {
    return presentAssertionError(error);
  } else {
    return presentRuntimeError(error);
  }
}

function presentAssertionError(error) {
  return presentError({ description: error.message, stackTrace: extractErrorStack(error) });
}

function presentRuntimeError(error) {
  let description, stackTrace;

  if (error instanceof Error) {
    description = `${error.name}: ${error.message}`;
    stackTrace = extractErrorStack(error);
  } else {
    description = `Error: ${inspect(error)}`;
    stackTrace = "(no stack trace)";
  }

  return presentError({ description, stackTrace });
}

function presentError({description, stackTrace}) {
  return joinLines(chalk.red(description), chalk.cyan(addPadding(stackTrace, 2)));
}
