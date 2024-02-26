import { runTest } from "./run-test";
import { SourceLocator } from "utils/source-locator";
import { AsyncJob } from "utils/async-job";

export class Test {
  constructor(name, body, { context, skip=false }) {
    this.sourceLocator = new SourceLocator({ sourceError: new Error() });
    this.ownName = name || '(unnamed)';
    this.skipped = typeof body !== 'function' ? true : skip;

    this._context = context;
    this._runnerJob = new AsyncJob(() => runTest(body, context));
  }

  get name() {
    return this._context.testName(this.ownName);
  }

  get result() {
    return this._runnerJob.result;
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
    if (this.skipped) {
      throw new Error('Attempted to run a skipped test'); 
    } else {
      return this._runnerJob.run();
    }
  }
}
