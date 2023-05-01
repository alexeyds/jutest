import { Test } from "core/test";
import { AsyncJob } from "utils/async-job";
import { createDelegator } from "utils/delegator";

export class TestSuite {
  constructor(name, body, { context }) {
    context = context.copy();
    context.addName(name);
    this._context = context;

    this.isLocked = false;
    this._testsAndSuites = [];
    this._job = new AsyncJob(() => this._composeTests(body));
  }

  get name() {
    return this._context.name;
  }

  get tests() {
    return this._job.result;
  }

  get isReady() {
    return this._job.wasRun;
  }

  get isASuite() {
    return true;
  }

  composeTests() {
    return this._job.run();
  }

  async _composeTests(suiteBody) {
    let result = [];

    let suiteBuilder = new SuiteBuilder(this);
    await suiteBody(suiteBuilder);

    this._lock();

    for (let testOrSuite of this._testsAndSuites) {
      if (testOrSuite.isASuite) {
        let tests = await testOrSuite.composeTests();
        result.push(...tests);
      } else {
        result.push(testOrSuite);
      }
    }

    return result;
  }

  _lock() {
    this._context.lock();
    this.isLocked = true;
  }

  _addTest(name, body) {
    this._addItem(Test, name, body);
  }

  _addSuite(name, body) {
    this._addItem(TestSuite, name, body);
  }

  _addItem(ItemClass, name, body) {
    if (this.isLocked) {
      let type = ItemClass === TestSuite ? 'suite' : 'test';

      throw new Error(
        `Test suite "${this.name}" is locked and doesn't accept new tests/suites (attempted to register ${type} "${name}"). `+
        `Make sure that your tests are only registered from within the given test suite's body.`
      );
    }

    let item = new ItemClass(name, body, { context: this._context });
    this._testsAndSuites.push(item);
  }
}

class SuiteBuilder {
  constructor(suite) {
    Object.assign(this, createDelegator(suite, {
      _addTest: 'test',
      _addSuite: 'describe',
    }));

    Object.assign(this, createDelegator(suite._context, {
      addBeforeTestAssertion: 'assertBeforeTest',
      addAfterTestAssertion: 'assertAfterTest',
      addSetup: 'setup',
      addTeardown: 'teardown',
    }));
  }
}
