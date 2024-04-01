import chalk from 'chalk';
import { presentMilliseconds } from "utils/time";
import { sum } from "utils/array";

export class SummaryReporter {
  constructor(reporterConfig) {
    this._config = reporterConfig;
  }

  finishReporting(runSummaries) {
    let summariesData = collectSummariesData(runSummaries);
    this._reportTestCounts(summariesData);
    this._reportRunTime(summariesData);
  }

  _reportTestCounts({ totalCount, failedCount, skippedCount }) {
    let color = failedCount > 0 ? chalk.red : chalk.green;
    this._stdout(color(`\nTotal: ${totalCount}, Failed: ${failedCount}`) + '\n');

    if (skippedCount > 0) {
      this._stdout(chalk.yellow(`Skipped: ${skippedCount}`) + '\n');
    }
  }

  _reportRunTime({ runTime, fileLoadTime }) {
    this._stdout(
      `Total run time: ${presentMilliseconds(runTime)}s, ` +
      `files took ${presentMilliseconds(fileLoadTime)}s to load\n`
    );
  }

  get _stdout() {
    return this._config.stdout;
  }
}

function collectSummariesData(runSummaries) {
  let totalCount = 0;
  let failedCount = 0;
  let skippedCount = 0;
  let runTime = 0;
  let fileLoadTime = 0;

  for (let runSummary of runSummaries) {
    totalCount += runSummary.totalTestsCount;
    failedCount += runSummary.failedTestsCount;
    skippedCount += runSummary.skippedTestsCount;
    runTime += runSummary.runTime;
    fileLoadTime += sum(runSummary.fileLoadTimes, t => t.loadTime);
  }

  return {
    totalCount,
    failedCount,
    skippedCount,
    runTime,
    fileLoadTime,
  };
}
