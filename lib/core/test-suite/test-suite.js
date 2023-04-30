import { Test } from "core/test";
import { AsyncJob } from "utils/async-job";
import { createDelegator } from "utils/delegator";
import { SuiteBuilder } from "./suite-builder";

export class TestSuite {
  constructor(name, body, { context }) {
    context = context.copy();
    context.addName(name);
    this.context = context;

    this._job = new AsyncJob(() => composeTestsWithPublicAPI(this, body));
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

async function composeTestsWithPublicAPI(suite, body) {
  let builder = new SuiteBuilder(suite);
  let api = createPublicBuildAPI({ builder, context: suite.context });
  await body(api);

  return await builder.composeTests();
}

function createPublicBuildAPI({ builder, context }) {
  let builderDelegator = createDelegator(builder, {
    addTest: 'test',
    addSuite: 'describe',
  });

  let contextDelegator = createDelegator(context, {
    addBeforeTestAssertion: 'assertBeforeTest',
    addAfterTestAssertion: 'assertAfterTest',
    addSetup: 'setup',
    addTeardown: 'teardown',
  });

  return { ...builderDelegator, ...contextDelegator };
}
