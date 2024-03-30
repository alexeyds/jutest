import chalk from 'chalk';
import { presentMilliseconds } from "utils/time";
import { sum } from "utils/array";

export class SummaryReporter {
  constructor({ stdout }) {
    this.stdout = stdout;
  }

  finishReporting(runSummaries) {
    let summariesData = collectSummariesData(runSummaries);
    this._reportTestCounts(summariesData);
    this._reportRunTime(summariesData);
  }

  _reportTestCounts({ totalCount, failedCount, skippedCount }) {
    let reports = [];

    reports.push(`Total: ${totalCount}`);
    reports.push(`Failed: ${failedCount}`);

    if (skippedCount > 0) {
      reports.push(chalk.yellow(`Skipped: ${skippedCount}`));
    }

    let color = failedCount > 0 ? chalk.red : chalk.green;
    this.stdout(color(reports.join(', ')) + "\n");
  }

  _reportRunTime({ runTime, fileLoadTime }) {
    this.stdout(
      `Total run time: ${presentMilliseconds(runTime)}s, ` +
      `files took ${presentMilliseconds(fileLoadTime)}s to load\n`
    );
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
