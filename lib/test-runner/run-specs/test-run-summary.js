import { SpecSummary } from "./spec-summary";
import { Test } from "core";

export class TestRunSummary {
  constructor() {
    this.success = true;
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
      case Test.ExecutionStatuses.Passed:
        this.passedTestsCount += 1;
        break;
      case Test.ExecutionStatuses.Failed:
        this.success = false;
        this.failedTestsCount += 1;
        break;
      case Test.ExecutionStatuses.Skipped:
        this.skippedTestsCount += 1;
        break;
    }

    this.testSummaries.push(summary);
    return summary;
  }

  toObject() {
    return { ...this };
  }
}
