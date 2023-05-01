import { Test } from "core/test";
import { AsyncJob } from "utils/async-job";
import { createDelegator } from "utils/delegator";

export class TestSuite {
  constructor(name, body, { context }) {
    context = context.copy();
    context.addName(name);
    this._context = context;

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

  _addTest(name, body) {
    let test = new Test(name, body, { context: this._context });
    this._testsAndSuites.push(test);
  }

  _addSuite(name, body) {
    let suite = new TestSuite(name, body, { context: this._context });
    this._testsAndSuites.push(suite);
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
