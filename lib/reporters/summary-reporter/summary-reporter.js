import chalk from 'chalk';
import { buildTextSection } from "utils/text-section";
import { presentMilliseconds } from "utils/time";
import { sum } from "utils/array";

export class SummaryReporter {
  constructor(reporterConfig) {
    this._config = reporterConfig;
  }

  static startReporting(reporterConfig, _eventEmitter) {
    return new SummaryReporter(reporterConfig);
  }

  finishReporting(runSummaries) {
    let { totalCount, failedCount, skippedCount, runTime, fileLoadTime } = collectSummariesData(runSummaries);

    let section = buildTextSection(s => {
      s.addLine();

      s.addLine(
        `Total run time: ${presentMilliseconds(runTime)}s, ` +
        `files took ${presentMilliseconds(fileLoadTime)}s to load`
      );

      let testCounts = [`Total: ${totalCount}`, `Failed: ${failedCount}`];

      if (skippedCount > 0) {
        testCounts.push(`Skipped: ${skippedCount}`);
      }

      let color = failedCount > 0 ? 'red' : 'green';
      s.addLine(chalk[color](testCounts.join(", ")));
    });

    this._stdout(section);
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
