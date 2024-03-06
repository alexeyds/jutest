import { ExecutionStatuses } from "./execution-statuses";
import { ExecutionResult } from "./execution-result";
import { runTest } from "./run-test";
import { SourceLocator } from "utils/source-locator";
import { AsyncJob } from "utils/async-job";

export class Test {
  static ExecutionStatuses = ExecutionStatuses;

  constructor(name, body, { context, skip=false, sourceFilePath }) {
    this._context = context;

    if (skip) {
      this._skippedResult = ExecutionResult.skipped('skipped with xtest/xdescribe');
    } else if (typeof body !== 'function') {
      skip = true;
      this._skippedResult = ExecutionResult.skipped('not implemented yet');
    }

    this.sourceLocator = new SourceLocator({ sourceError: new Error(), sourceFilePath });
    this.ownName = name || '(unnamed)';
    this.skipped = skip;

    this._runnerJob = new AsyncJob(() => {
      if (this.skipped) {
        return this._skippedResult;
      } else {
        return runTest(body, context);
      }
    });
  }

  get name() {
    return this._context.testName(this.ownName);
  }

  get result() {
    return this._skippedResult || this._runnerJob.result;
  }

  get wasRun() {
    return this._runnerJob.wasRun;
  }

  get isASuite() {
    return false;
  }

  get contextId() {
    return this._context.id;
  }

  get parentContextIds() {
    return this._context.parentIds;
  }

  run() {
    return this._runnerJob.run();
  }
}
