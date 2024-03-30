import { inspect } from "util";
import chalk from 'chalk';
import { AssertionFailedError } from "assertions";
import { traceFailedLine, readFailedLine } from "reporters/utils/error-tracing";
import { addPadding, joinLines, presentStackTrace } from "reporters/utils/formatting";
import { Test } from "core";

export class ProgressReporter {
  constructor() {
    this._allTests = [];
    this._failedTestsDescriptions = [];
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
      let testNumber = this._failedTestsDescriptions.length + 1;
      let descriptionPromise = presentFailedTest(testSummary, { number: testNumber, config: this.config });
      this._failedTestsDescriptions.push(descriptionPromise.then(d => addPadding(d, 2)));

      process.stderr.write(chalk.red('F'));
    }
  }

  async finishReporting() {
    if (this._failedTestsDescriptions.length > 0) {
      this._printSection('Failures:');

      let descriptions = await Promise.all(this._failedTestsDescriptions);
      descriptions.forEach(this._printSection);
    }

    process.stderr.write("\n");
  }

  _printSection(text) {
    process.stderr.write('\n\n' + text);
  }
}

async function presentFailedTest(testSummary, { number, config }) {
  let testName = `${number}) ${testSummary.name}`;
  let errorDetails = addPadding(await presentError(testSummary.executionResult.error, config), 4);

  return testName + '\n\n' + errorDetails;
}

async function presentError(error, config) {
  let failedLine = await getFailedLine(error, config);
  let description = getErrorDescription(error);
  let stackTrace = getStackTrace(error, config);

  return joinLines(
    chalk.red(description),
    failedLine ? chalk.yellow(`\n${failedLine}`) : '',
    chalk.cyan(addPadding(stackTrace, 2))
  );
}

async function getFailedLine(error, config) {
  if (error instanceof Error) {
    return await readFailedLine(error, config);
  } else {
    return null;
  }
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
