import { runTest } from "./run-test";
import { SourceLocator } from "utils/source-locator";
import { AsyncJob } from "utils/async-job";

export class Test {
  constructor(name, body, { context }) {
    this.sourceLocator = new SourceLocator({ sourceError: new Error() });
    this.ownName = name;
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

  run() {
    return this._runnerJob.run();
  }
}
