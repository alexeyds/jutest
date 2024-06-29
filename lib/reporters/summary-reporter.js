import chalk from 'chalk';
import { buildTextSection } from "utils/text-section";
import { presentMilliseconds } from "utils/time";
import { sum } from "utils/array";

export class SummaryReporter {
  constructor(runtimeConfig) {
    this._config = runtimeConfig;
  }

  static initializeReporter(runtimeConfig, _eventEmitter) {
    return new SummaryReporter(runtimeConfig);
  }

  finishReporting(runSummary) {
    let {
      totalTestsCount,
      failedTestsCount,
      skippedTestsCount,
      runTime,
    } = runSummary;

    let fileLoadTime = sum(runSummary.fileLoadTimes, t => t.loadTime);

    let section = buildTextSection(s => {
      s.addLine();

      s.addLine(
        `Run time: ${presentMilliseconds(runTime)}, ` +
        `files took ${presentMilliseconds(fileLoadTime)} to load`
      );

      let testCounts = [`Total: ${totalTestsCount}`, `Failed: ${failedTestsCount}`];

      if (skippedTestsCount > 0) {
        testCounts.push(`Skipped: ${skippedTestsCount}`);
      }

      let color = failedTestsCount > 0 ? 'red' : 'green';
      s.addLine(chalk[color](testCounts.join(", ")));
    });

    this._stdout(section);
  }

  get _stdout() {
    return this._config.stdout;
  }
}
