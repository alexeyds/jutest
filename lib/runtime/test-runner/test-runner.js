import { EventEmitter } from "utils/event-emitter";
import { createDelegator } from "utils/delegator";

const TEST_RUNNER_EVENTS = [
  'run-start',
  'suite-start',
  'test-start',
  'test-end',
  'suite-end',
  'run-end',
];

export class TestRunner {
  constructor({ specsContainer }) {
    this._specsContainer = specsContainer;
    this._eventEmitter = new EventEmitter(TEST_RUNNER_EVENTS);
    this._result = { allTestsPassed: true };

    Object.assign(this, createDelegator(this._eventEmitter, {
      on: 'on',
      off: 'off',
    }));
  }

  async runAll() {
    return await this._run(this._allSpecs);
  }

  async runAtFileLocation({ fileName, lineNumber }) {
    let allSpecs = this._allSpecs;
    let specToRun = await findSpecAtLocation(allSpecs, { fileName, lineNumber });
    let specsToRun = specToRun ? [specToRun] : allSpecs;

    return await this._run(specsToRun);
  }

  async _run(specs) {
    this._emit('run-start');
    await this._runSpecs(specs);
    this._emit('run-end');

    return this._result;
  }

  async _runSpecs(specs) {
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
    await this._runSpecs(await suite.composeSpecs());
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

  get _allSpecs() {
    return this._specsContainer.specs;
  }

  _emit(...args) {
    return this._eventEmitter.emit(...args);
  }
}

async function findSpecAtLocation(specs, { fileName, lineNumber }) {
  let result;

  for (let spec of specs) {
    if (spec.sourceLocator.guessLineNumberInFile(fileName) === lineNumber) {
      result = spec;
    } else if (spec.isASuite) {
      let suiteSpecs = await spec.composeSpecs();
      result = findSpecAtLocation(suiteSpecs, { fileName, lineNumber });
    }

    if (result) break;
  }

  return result;
}
