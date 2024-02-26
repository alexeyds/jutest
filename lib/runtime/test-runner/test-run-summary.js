import { pick } from "utils/object";
import { SpecSummary } from "./spec-summary";
import { ExitReasons, TestStatuses } from "./enums";

export class TestRunSummary {
  static ExitReasons = ExitReasons;

  constructor() {
    this.runStartedAt = null;
    this.runEndedAt = null;
    this.exitReason = null;

    this.totalTestsCount = 0;
    this.passedTestsCount = 0;
    this.skippedTestsCount = 0;
    this.failedTestsCount = 0;

    this.testSummaries = [];
  }

  startRun() {
    this.runStartedAt = Date.now();
  }

  endRun({ exitReason }) {
    this.runEndedAt = Date.now();
    this.exitReason = exitReason;
  }

  addTestResult(test) {
    let summary = new SpecSummary(test);

    this.totalTestsCount += 1;

    switch (summary.executionResult.status) {
      case TestStatuses.Passed:
        this.passedTestsCount += 1;
        break;
      case TestStatuses.Failed:
        this.failedTestsCount += 1;
        break;
      case TestStatuses.Skipped:
        this.skippedTestsCount += 1;
        break;
    }

    this.testSummaries.push(summary);
    return summary;
  }

  toObject() {
    return pick(this, [
      'runStartedAt',
      'runEndedAt',
      'exitReason',
      'totalTestsCount',
      'passedTestsCount',
      'skippedTestsCount',
      'failedTestsCount',
      'testSummaries',
    ]);
  }
}
