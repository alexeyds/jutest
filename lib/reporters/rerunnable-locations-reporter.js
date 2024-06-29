import { Test } from "core";
import chalk from 'chalk';
import { buildTextSection } from "utils/text-section";
import { presentTestLocation } from "reporters/shared";

const { ExecutionStatuses } = Test;

export class RerunnableLocationsReporter {
  constructor(runtimeConfig) {
    this._config = runtimeConfig;
  }

  static initializeReporter(runtimeConfig, _eventEmitter) {
    return new RerunnableLocationsReporter(runtimeConfig);
  }

  async finishReporting(runSummary) {
    let testsWithLocations = failedTestsWithLocations(runSummary);

    if (testsWithLocations.length > 0) {
      this._reportFailedTests(testsWithLocations);
    }
  }

  _reportFailedTests(testsWithLocations) {
    let section = buildTextSection(s => {
      s.addLine();
      s.addLine('Failed tests:');
      s.addLine();

      testsWithLocations.forEach(([test, location]) => {
        s.addLine(
          chalk.red(`${this._config.jutestRunCommand} ${location} `) +
          chalk.cyan(`# ${test.name}`)
        );
      });

      s.addLine();
    });

    this._config.stdout(section);
  }
}

function failedTestsWithLocations(runSummary) {
  let result = [];

  for (let testSummary of runSummary.testSummaries) {
    let { status } = testSummary.executionResult;
    let location = presentTestLocation(testSummary.definitionLocation);

    if (status === ExecutionStatuses.Failed && location) {
      result.push([testSummary, location]);
    }
  }

  return result;
}
