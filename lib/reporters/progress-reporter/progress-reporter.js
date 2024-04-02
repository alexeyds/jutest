import chalk from 'chalk';
import { TestRunnerEnums } from "test-runner";
import { Test } from "core";

const { Events } = TestRunnerEnums;
const { ExecutionStatuses } = Test;

export class ProgressReporter {
  constructor(reporterConfig) {
    this._config = reporterConfig;
  }

  registerListeners(eventEmitter) {
    [Events.TestEnd, Events.TestSkip].forEach(event => {
      eventEmitter.on(event, (...args) => this._reportTestResult(...args));
    });
  }

  _reportTestResult(testSummary) {
    switch (testSummary.executionResult.status) {
      case ExecutionStatuses.Passed:
        this._stdout(chalk.green('.'));
        break;
      case ExecutionStatuses.Failed:
        this._stdout(chalk.red('F'));
        break;
      case ExecutionStatuses.Skipped:
        this._stdout(chalk.yellow('.'));
        break;
    }
  }

  async finishReporting() {
    this._stdout("\n");
  }

  get _stdout() {
    return this._config.stdout;
  }
}
