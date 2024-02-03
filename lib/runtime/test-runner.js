import { EventEmitter } from "utils/event-emitter";
import { createDelegator } from "utils/delegator";

const TEST_RUNNER_EVENTS = [
  'run-start',
  'suites-loaded',
  'suite-start',
  'test-start',
  'test-end',
  'suite-end',
  'run-end',
]

export class TestRunner {
  constructor({ testsContainer }) {
    this._testsContainer = testsContainer;
    this._eventEmitter = new EventEmitter(TEST_RUNNER_EVENTS);
    this._result = { allTestsPassed: true };

    Object.assign(this, createDelegator(this._eventEmitter, {
      on: 'on',
      off: 'off',
    }))
  }

  async run() {
    let testsAndSuites = this._testsContainer.testsAndSuites;

    this._emit('run-start');
    await this._composeSuites(testsAndSuites);
    this._emit('suites-loaded');
    await this._runTestsAndSuites(testsAndSuites);
    this._emit('run-end');

    return this._result;
  }

  async _composeSuites(testsAndSuites) {
    for (let testOrSuite of testsAndSuites) {
      if (testOrSuite.isASuite) {
        await testOrSuite.compose();
      }
    }
  }

  async _runTestsAndSuites(testsAndSuites) {
    for (let testOrSuite of testsAndSuites) {
      await this._runTestOrSuite(testOrSuite);
    }
  }

  async _runTestOrSuite(testOrSuite) {
    if (testOrSuite.isASuite) {
      await this._runSuite(testOrSuite);
    } else {
      await this._runTest(testOrSuite);
    }
  }

  async _runSuite(suite) {
    this._emit('suite-start', suite);
    await this._runTestsAndSuites(suite.testsAndSuites);
    this._emit('suite-end', suite);
  }

  async _runTest(test) {
    this._emit('test-start', test);
    await test.run();
    this._emit('test-end', test);

    if (!test.result.passed) {
      this._result.allTestsPassed = false;
    }
  }

  _emit(...args) {
    return this._eventEmitter.emit(...args);
  }
}
