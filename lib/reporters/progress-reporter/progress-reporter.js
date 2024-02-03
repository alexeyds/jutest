import { inspect } from "util";
import chalk from 'chalk';
import { AssertionFailedError } from "assertions";
import { traceFailedLine, readFailedLine } from "reporters/utils/error-tracing";
import { addPadding, joinLines, presentStackTrace } from "reporters/utils/formatting";

export class ProgressReporter {
  constructor() {
    this._allTests = [];
    this._failedTestsDescriptions = [];
    this.config = null;
  }

  reportCompletedTest(test) {
    this._allTests.push(test);

    if (test.result.passed) {
      process.stderr.write(chalk.green('.'));
    } else {
      let testNumber = this._failedTestsDescriptions.length + 1;
      let descriptionPromise = presentFailedTest(test, { number: testNumber, config: this.config });
      this._failedTestsDescriptions.push(descriptionPromise.then(d => addPadding(d, 2)));

      process.stderr.write(chalk.red('F'));
    }
  }

  async reportSummary() {
    if (this._failedTestsDescriptions.length > 0) {
      this._printSection('Failures:');

      let descriptions = await Promise.all(this._failedTestsDescriptions);
      descriptions.forEach(this._printSection);
    }

    let summary = `Total: ${this._allTests.length}, Failed: ${this._failedTestsDescriptions.length}\n`;
    let color = this._failedTestsDescriptions.length > 0 ? chalk.red : chalk.green;
    this._printSection(color(summary));
  }

  _printSection(text) {
    process.stderr.write('\n\n' + text);
  }
}

async function presentFailedTest(test, { number, config }) {
  let testName = `${number}) ${test.name}`;
  let errorDetails = addPadding(await presentError(test.result.error, config), 4);

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
