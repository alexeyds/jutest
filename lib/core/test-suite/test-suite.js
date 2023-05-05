import { Test } from "core/test";
import { AsyncJob } from "utils/async-job";
import { createDelegator } from "utils/delegator";

export class TestSuite {
  constructor(name, body, { context }) {
    context = context.copy();
    context.addName(name);
    this.context = context;
    this.isLocked = false;

    this._job = new AsyncJob(() => composeSuite(this, body));
  }

  get name() {
    return this.context.name;
  }

  get testsAndSuites() {
    return this._job.result;
  }

  get isReady() {
    return this._job.wasRun;
  }

  get isASuite() {
    return true;
  }

  lock() {
    this.context.lock();
    this.isLocked = true;
  }

  compose() {
    return this._job.run();
  }

  validateCanAdd(ItemClass, name) {
    if (this.isLocked) {
      let type = ItemClass === TestSuite ? 'suite' : 'test';

      throw new Error(
        `Test suite "${this.name}" is locked and doesn't accept new tests/suites (attempted to register ${type} "${name}"). `+
        `Make sure that your tests are only registered from within the given test suite's body.`
      );
    }

    return true;
  }
}

async function composeSuite(suite, body) {
  let testsAndSuites = [];
  let suiteBuilder = createSuiteBuilder(suite, testsAndSuites);

  await body(suiteBuilder);
  suite.lock();

  for (let item of testsAndSuites) {
    if (item.isASuite) await item.compose();
  }

  return testsAndSuites;
}

function createSuiteBuilder(suite, testsAndSuites) {
  let suiteBuilder = new SuiteBuilder();

  Object.assign(suiteBuilder, createDelegator(suite.context, {
    addBeforeTestAssertion: 'assertBeforeTest',
    addAfterTestAssertion: 'assertAfterTest',
    addSetup: 'setup',
    addTeardown: 'teardown',
  }));

  suiteBuilder.test = (name, body) => {
    suite.validateCanAdd(Test, name);

    let test = new Test(name, body, { context: suite.context });
    testsAndSuites.push(test);
  };

  suiteBuilder.describe = (name, body) => {
    suite.validateCanAdd(TestSuite, name);

    let nestedSuite = new TestSuite(name, body, { context: suite.context });
    testsAndSuites.push(nestedSuite);
  };

  return suiteBuilder;
}

class SuiteBuilder {}
