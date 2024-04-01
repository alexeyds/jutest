export class FailedTestsReporter {
  constructor(reporterConfig) {
    this._config = reporterConfig;
  }

  get _stdout() {
    return this._config.stdout;
  }
}
