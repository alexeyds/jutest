import { AsyncJob } from "utils/job";
import { Test } from "core/test";
import { SuiteBuilder } from "./suite-builder";

export class TestSuite {
  constructor(name, body, { context }) {
    context = context.copy();
    context.addName(name);
    this.context = context;

    this._job = createBuilderJob(this, body);
  }

  get name() {
    return this.context.name;
  }

  get tests() {
    return this._job.result;
  }

  get isReady() {
    return this._job.wasRun;
  }

  composeTests() {
    return this._job.run();
  }

  createTest(name, body) {
    return new Test(name, body, { context: this.context });
  }

  createSuite(name, body) {
    return new TestSuite(name, body, { context: this.context });
  }
}

function createBuilderJob(suite, body) {
  return new AsyncJob(async () => {
    let builder = new SuiteBuilder(suite);
    let api = builder.toPublicAPI();
    await body(api);

    return await builder.composeTests();
  });
}
