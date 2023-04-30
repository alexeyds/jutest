import { runTest } from "./run-test";
import { AsyncJob } from "utils/async-job";

export class Test {
  constructor(name, body, { context }) {
    this.ownName = name;
    this.context = context;

    this._job = new AsyncJob(() => runTest(body, context));
  }

  get name() {
    return this.context.testName(this.ownName);
  }

  get result() {
    return this._job.result;
  }

  get wasRun() {
    return this._job.wasRun;
  }

  run() {
    return this._job.run();
  }
}
