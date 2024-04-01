import chalk from 'chalk';
import { buildSection } from "reporters/shared";
import { Test } from "core";
import { presentErrorMessage, presentSourceDetails } from "./error-presenters";

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
    let sourceDetails = await presentSourceDetails(error, this._config);

    let section = buildSection(s => {
      s.addLine(`${testNumber}) ${test.name}`);
      s.addLine();

      s.addSection(s => {
        s.addLine(chalk.red(presentErrorMessage(error)));
        s.addLine();
        s.addLine(chalk.yellow(sourceDetails.sourceLine));

        s.addSection(s => {
          sourceDetails.stackFrames.forEach(frame => {
            let color = sourceDetails.sourceFrame === frame ? 'yellow' : 'cyan';
            s.addLine(chalk[color](frame.stackFrame));
          });
        }, { padding: 2 });
      }, { padding: 4 });
    }, { padding: 2 });

    this._stdout(section);
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
