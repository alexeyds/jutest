import { inspect } from "util";
import chalk from 'chalk';
import { AssertionFailedError } from 'assertions/assertion';

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
      process.stdout.write('\n\n');
      process.stdout.write('Failures:\n\n');
      let errors = addPadding(extractTestsErrors(this._failedTests).join('\n\n'), 2);
      process.stdout.write(errors);
    }

    let color = this._failedTests.length > 0 ? chalk.red : chalk.green;
    process.stdout.write('\n');
    process.stdout.write('\n');
    console.log(color(`Total: ${this._allTests.length}, Failed: ${this._failedTests.length}`));
  }
}

function extractTestsErrors(tests) {
  return tests.map((test, i) => {
    let errorDescription = getErrorDescription(test.error);
    let number = `${i+1})`;

    return (
      `${number} ${test.testName}\n` +
      `\n` +
      addPadding(errorDescription, 4)
    );
  });
}

function getErrorDescription(error) {
  if (error instanceof AssertionFailedError) {
    return presentAssertionError(error);
  } else {      
    return presentRuntimeError(error);
  }
}

function presentAssertionError(error) {
  return (
    chalk.red(error.message) +
    `\n` +
    formatErrorStack(error)
  );
}

function presentRuntimeError(error) {
  if (error instanceof Error) {
    return chalk.red(`${error.name}: ${error.message}`) + '\n' + formatErrorStack(error);
  } else {
    return chalk.red(`Error: ${inspect(error)}`) + '\n' + chalk.cyan('    (no stack trace)');
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

function addPadding(text, numberOfSpaces) {
  return text
    .split('\n')
    .map(line => " ".repeat(numberOfSpaces) + line)
    .join('\n');
}
