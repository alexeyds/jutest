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
  constructor({ specsContainer }) {
    this._specsContainer = specsContainer;
    this._eventEmitter = new EventEmitter(TEST_RUNNER_EVENTS);
    this._result = { allTestsPassed: true };

    Object.assign(this, createDelegator(this._eventEmitter, {
      on: 'on',
      off: 'off',
    }))
  }

  async runAll() {
    await this._composeAllSuites();
    return await this._run(this._allTestsAndSuites);
  }

  async runAtFileLocation({ fileName, lineNumber }) {
    await this._composeAllSuites();

    let allSpecs = this._allTestsAndSuites;
    let specToRun = findSpecAtLocation(allSpecs, { fileName, lineNumber })
    let specsToRun = specToRun ? [specToRun] : allSpecs;

    return await this._run(specsToRun);
  }

  async _composeAllSuites() {
    for (let spec of this._allTestsAndSuites) {
      if (spec.isASuite) {
        await spec.compose();
      }
    }
    this._emit('suites-loaded')
  }

  async _run(specs) {
    this._emit('run-start');
    await this._runTestsAndSuites(specs);
    this._emit('run-end');

    return this._result;
  }

  async _runTestsAndSuites(specs) {
    for (let spec of specs) {
      await this._runSpec(spec);
    }
  }

  async _runSpec(spec) {
    if (spec.isASuite) {
      await this._runSuite(spec);
    } else {
      await this._runTest(spec);
    }
  }

  async _runSuite(suite) {
    this._emit('suite-start', suite);
    await this._runTestsAndSuites(suite.specs);
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

  get _allTestsAndSuites() {
    return this._specsContainer.specs;
  }

  _emit(...args) {
    return this._eventEmitter.emit(...args);
  }
}

function findSpecAtLocation(specs, { fileName, lineNumber }) {
  let result;

  for (let spec of specs) {
    if (spec.sourceLocator.guessLineNumberInFile(fileName) === lineNumber) {
      result = spec;
    } else if (spec.isASuite) {
      result = findSpecAtLocation(spec.specs, { fileName, lineNumber });
    }

    if (result) break;
  }

  return result;
}
