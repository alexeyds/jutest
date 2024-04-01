import { inspect } from "util";
import chalk from 'chalk';
import { SectionBuilder, ErrorSourceTracer } from "reporters/shared";
import { Test } from "core";

const { ExecutionStatuses } = Test;

export class FailedTestsReporter {
  constructor(reporterConfig) {
    this._config = reporterConfig;
    this._failedTests = [];
  }

  async finishReporting(runSummaries) {
    let { failedTests } = collectReportableTests(runSummaries);
    await this._reportFailedTests(failedTests);
  }

  async _reportFailedTests(failedTests) {
    if (failedTests.length === 0) {
      return;
    }

    this._stdout("\nFailures:\n\n");

    let testNumber = 1;
    for (let test of failedTests) {
      await this._reportFailedTest(test, testNumber);
      testNumber += 1;
    }
  }

  async _reportFailedTest(test, testNumber) {
    let { error } = test.executionResult;
    let hasStack = !!error?.stack;
    let sourceTracer = new ErrorSourceTracer(error, this._config);
    let sourceLine = hasStack && await sourceTracer.readSourceLine();

    let section = new SectionBuilder({ padding: 2 });
    section.addLine(`${testNumber}) ${test.name}`);
    section.addLine();
    section.addSection({ padding: 4 }, s => {
      s.addLine(chalk.red(presentTestErrorMessage(error)));
      s.addLine();

      if (hasStack) {
        s.addLine(chalk.yellow(sourceLine));
        s.addSection({ padding: 2 }, s => {
          sourceTracer.stackFrames.forEach((frame) => {
            if (frame.isInternal) return;
            let frameLine = frame.stackFrame;
            if (sourceTracer.sourceFrame === frame) {
              frameLine = chalk.yellow(frameLine);
            } else {
              frameLine = chalk.cyan(frameLine);
            }
            s.addLine(frameLine);
          });
        });
      } else {
        s.addLine(chalk.yellow("(no stack trace)"));
      }
    });

    this._stdout(section.toString());
  }

  get _stdout() {
    return this._config.stdout;
  }

}

function collectReportableTests(runSummaries) {
  let failedTests = [];

  for (let runSummary of runSummaries) {
    for (let testSummary of runSummary.testSummaries) {
      let { status } = testSummary.executionResult;

      if (status === ExecutionStatuses.Failed) {
        failedTests.push(testSummary);
      }
    }
  }

  return { failedTests };
}

function presentTestErrorMessage(error) {
  let name = error?.name;

  if (name === 'AssertionFailedError') {
    return error.message;
  } else if (name) {
    return `${error.name}: ${error.message}`;
  } else {
    return `Runtime error: ${inspect(error)}`;
  }
}
