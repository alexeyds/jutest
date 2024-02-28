const Statuses = {
  Passed: 'passed',
  Failed: 'failed',
  Skipped: 'skipped',
};

export class TestExecutionResult {
  static Statuses = Statuses;

  static passed() {
    return new TestExecutionResult({ status: Statuses.Passed });
  }

  static failed(error) {
    return new TestExecutionResult({ status: Statuses.Failed, error });
  }

  static skipped(skipReason) {
    return new TestExecutionResult({ status: Statuses.Skipped, skipReason });
  }

  constructor({ status, error=null, skipReason=null }) {
    this.status = status;
    this.error = error;
    this.teardownError = null;
    this.skipReason = skipReason;
  }

  addTeardownError(error) {
    this.status = Statuses.Failed;
    this.teardownError = error;
  }

  toObject() {
    return { ...this };
  }
}
