import { Test } from "core/test";
import { AsyncJob } from "utils/async-job";
import { createDelegator } from "utils/delegator";

export class TestSuite {
  constructor(name, body, { context }) {
    context = context.copy();
    context.addName(name);
    this._context = context;

    this._job = new AsyncJob(() => composeSuite(this, body));
  }

  get name() {
    return this._context.name;
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

  compose() {
    return this._job.run();
  }

  _lock() {
    this._context.lock(
      `Test context for "${this.name}" suite is locked and cannot be modified. `+
      `Make sure that you only add setups, teardowns, etc. inside the test suite's body.`
    );
  }

  _validateCanAdd(ItemClass, name) {
    if (this._context.isLocked) {
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
  suite._lock();

  for (let item of testsAndSuites) {
    if (item.isASuite) await item.compose();
  }

  return testsAndSuites;
}

function createSuiteBuilder(suite, testsAndSuites) {
  let suiteBuilder = new SuiteBuilder();

  Object.assign(suiteBuilder, suite._context.toConfigurationAPI());

  suiteBuilder.test = (name, body) => {
    suite._validateCanAdd(Test, name);

    let test = new Test(name, body, { context: suite._context });
    testsAndSuites.push(test);
  };

  suiteBuilder.describe = (name, body) => {
    suite._validateCanAdd(TestSuite, name);

    let nestedSuite = new TestSuite(name, body, { context: suite._context });
    testsAndSuites.push(nestedSuite);
  };

  return suiteBuilder;
}

class SuiteBuilder {}
