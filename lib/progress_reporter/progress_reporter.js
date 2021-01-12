import { inspect } from "util";
import chalk from 'chalk';
import { AssertionFailedError } from 'assertions/assertion';
import { traceFailedLine } from "reporters/error_tracing";
import { addPadding, joinLines, presentStackTrace } from "reporters/formatting";

export default class ProgressReporter {
  constructor() {
    this._allTests = [];
    this._failedTests = [];
    this.config = null;
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
        let errorDetails = addPadding(presentFailedTest(test, { number: i+1, config: this.config }), 2);
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

function presentFailedTest(test, { number, config }) {
  let testName = `${number}) ${test.testName}`;
  let errorDetails = addPadding(presentError(test.error, config), 4);

  return testName + '\n\n' + errorDetails;
}

function presentError(error, config) {
  let description = getErrorDescription(error);
  let stackTrace = getStackTrace(error, config);

  return joinLines(
    chalk.red(description),
    chalk.cyan(addPadding(stackTrace, 2))
  );
}

function getErrorDescription(error) {
  if (error instanceof AssertionFailedError) {
    return error.message;
  } else if (error instanceof Error) {
    return `${error.name}: ${error.message}`;
  } else {
    return `Error: ${inspect(error)}`;
  }
}

function getStackTrace(error, config) {
  let result = presentStackTrace(error);

  if (error instanceof Error) {
    let failedLine = traceFailedLine(error, config);
    result = result.replace(failedLine, chalk.yellow(failedLine));
  }

  return result;
}