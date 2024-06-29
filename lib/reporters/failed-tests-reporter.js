import chalk from 'chalk';
import { buildTextSection } from "utils/text-section";
import { Test } from "core";
import { presentErrorMessage, presentSourceDetails, presentTestLocation } from "reporters/shared";

const { ExecutionStatuses } = Test;

export class FailedTestsReporter {
  constructor(runtimeConfig) {
    this._config = runtimeConfig;
    this._failedTests = [];
  }

  static initializeReporter(runtimeConfig, _eventEmitter) {
    return new FailedTestsReporter(runtimeConfig);
  }

  async finishReporting(runSummary) {
    let { failedTests, skippedTests } = collectReportableTests(runSummary);
    await this._reportTests(skippedTests, 'Skipped', '_reportSkippedTest');
    await this._reportTests(failedTests, 'Failures', '_reportFailedTest');
  }

  async _reportTests(tests, groupName, reporterMethod) {
    if (tests.length === 0) {
      return;
    }

    this._stdout(`\n${groupName}:\n\n`);

    let testNumber = 1;
    for (let test of tests) {
      await this[reporterMethod](test, testNumber);
      testNumber += 1;
    }
  }

  async _reportFailedTest(test, testNumber) {
    let { error } = test.executionResult;
    let sourceDetails = await presentSourceDetails(error, this._config);

    let section = buildNumberedTestSection(test, testNumber, s => {
      s.addSection(s => {
        s.addLine(chalk.red(presentErrorMessage(error)));
        s.addLine();

        if (sourceDetails.sourceLine) {
          s.addLine(chalk.yellow(sourceDetails.sourceLine));
        }

        s.addSection(s => {
          let { stackFrames } = sourceDetails;

          stackFrames.forEach(frame => {
            let color = sourceDetails.sourceFrame === frame ? 'yellow' : 'cyan';
            if (stackFrames.length === 1) color = 'cyan';

            s.addLine(chalk[color](frame.stackFrame));
          });
        }, { padding: 2 });
      });
    });

    this._stdout(section);
  }

  async _reportSkippedTest(test, testNumber) {
    let section = buildNumberedTestSection(test, testNumber, s => {
      s.addSection(s => {
        s.addLine(chalk.yellow(test.executionResult.skipReason));

        let testLocation = presentTestLocation(test.definitionLocation);
        if (testLocation) {
          s.addSection(s => {
            s.addLine(chalk.cyan(`at ${testLocation}`));
          }, { padding: 2 });
        }
      });
    });

    this._stdout(section);
  }

  get _stdout() {
    return this._config.stdout;
  }

  get _jutestRunCommand() {
    return this._config.jutestRunCommand;
  }
}

function collectReportableTests(runSummary) {
  let failedTests = [];
  let skippedTests = [];

  for (let testSummary of runSummary.testSummaries) {
    let { status } = testSummary.executionResult;

    if (status === ExecutionStatuses.Failed) {
      failedTests.push(testSummary);
    } else if (status === ExecutionStatuses.Skipped) {
      skippedTests.push(testSummary);
    }
  }

  return { failedTests, skippedTests };
}

function buildNumberedTestSection(test, testNumber, sectionBuilder) {
  return buildTextSection(s => {
    s.addLine();

    let testNumberPrefix = `${testNumber}) `;
    s.addLine(`${testNumberPrefix}${test.name}`);
    s.addLine();

    s.addSection(sectionBuilder, {
      padding: testNumberPrefix.length
    });
  }, { padding: 2 });
}
