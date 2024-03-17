import { SpecSummary } from "./spec-summary";
import { Test } from "core";
import { TestRunnerEnums } from "test-runner/enums";

let { ExitReasons } = TestRunnerEnums;

export class RunSummary {
  constructor() {
    this.success = true;
    this.exitReason = null;

    this.totalTestsCount = 0;
    this.runTestsCount = 0;
    this.passedTestsCount = 0;
    this.skippedTestsCount = 0;
    this.failedTestsCount = 0;

    this.testSummaries = [];
  }

  setTotalTestsCount(count) {
    this.totalTestsCount = count;
  }

  buildSpecSummary(spec) {
    return new SpecSummary(spec);
  }

  addTestResult(test) {
    let testSummary = this.buildSpecSummary(test);

    this.runTestsCount += 1;

    switch (testSummary.executionResult.status) {
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

    this.testSummaries.push(testSummary);
    return testSummary;
  }

  exitWithRunEnd() {
    this.exitReason = ExitReasons.RunEnd;
  }

  exitWithTeardownError() {
    this.exitReason = ExitReasons.TeardownError;
  }

  exitWithInterrupt() {
    this.exitReason = ExitReasons.Interrupt;
  }

  toObject() {
    return { ...this };
  }
}
