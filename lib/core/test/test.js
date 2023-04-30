import { runTest } from "./run-test";
import { AsyncJob } from "utils/job";

export class Test {
  constructor(name, body, { context }) {
    this.ownName = name;
    this.context = context;

    this._job = createRunnerJob(body, context, this.name);
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

function createRunnerJob(body, context, name) {
  return new AsyncJob(async () => {
    let result = await runTest(body, context);
    result.testName = name;
    return result;
  });
}
