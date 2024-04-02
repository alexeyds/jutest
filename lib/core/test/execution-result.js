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

  constructor({ status, error, skipReason=null }) {
    this.status = status;
    this.error = error;
    this.skipReason = skipReason;
  }

  toObject() {
    return { ...this };
  }
}
