import chalk from 'chalk';
import { TestRunnerEnums } from "test-runner";
import { Test } from "core";

const { Events } = TestRunnerEnums;
const { ExecutionStatuses } = Test;

export class ProgressReporter {
  constructor(runtimeConfig) {
    this._config = runtimeConfig;
    this._wasAnythingReported = false;
  }

  static initializeReporter(runtimeConfig, eventEmitter) {
    let reporter = new ProgressReporter(runtimeConfig);

    [Events.TestEnd, Events.TestSkip].forEach(event => {
      eventEmitter.on(event, (...args) => reporter._reportTestResult(...args));
    });

    return reporter;
  }

  async finishReporting() {
    if (this._wasAnythingReported) {
      this._stdout("\n");
    }
  }

  _reportTestResult(testSummary) {
    switch (testSummary.executionResult.status) {
      case ExecutionStatuses.Passed:
        this._reportTest('.', 'green');
        break;
      case ExecutionStatuses.Failed:
        this._reportTest('F', 'red');
        break;
      case ExecutionStatuses.Skipped:
        this._reportTest('*', 'yellow');
        break;
    }
  }

  _reportTest(text, color) {
    this._wasAnythingReported = true;
    this._stdout(chalk[color](text));
  }

  get _stdout() {
    return this._config.stdout;
  }
}
