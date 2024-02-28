import { ExecutionStatuses } from "./execution-statuses";

export class ExecutionResult {

  static passed() {
    return new ExecutionResult({ status: ExecutionStatuses.Passed });
  }

  static failed(error) {
    return new ExecutionResult({ status: ExecutionStatuses.Failed, error });
  }

  static skipped(skipReason) {
    return new ExecutionResult({ status: ExecutionStatuses.Skipped, skipReason });
  }

  constructor({ status, error=null, skipReason=null }) {
    this.status = status;
    this.error = error;
    this.teardownError = null;
    this.skipReason = skipReason;
  }

  addTeardownError(error) {
    this.status = ExecutionStatuses.Failed;
    this.teardownError = error;
  }

  toObject() {
    return { ...this };
  }
}
