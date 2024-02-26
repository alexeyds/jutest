import { EventEmitter } from "utils/event-emitter";
import { createDelegator } from "utils/delegator";
import { RunEvents, ExitReasons } from "./enums";
import { SpecSummary } from "./spec-summary";
import { TestRunSummary } from "./test-run-summary";

export class TestRunner {
  constructor({ specsContainer }) {
    this._specsContainer = specsContainer;
    this._eventEmitter = new EventEmitter(Object.values(RunEvents));
    this._summary = new TestRunSummary();

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
    this._summary.startRun();
    this._emit(RunEvents.RunStart);

    await this._runSpecs(specs);

    this._summary.endRun({ exitReason: ExitReasons.RunEnd });

    let runSummary = this._summary.toObject();
    this._emit(RunEvents.RunEnd, runSummary);

    return runSummary;
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
    let suiteSummary = new SpecSummary(suite);

    this._emit(RunEvents.SuiteStart, suiteSummary);
    await this._runSpecs(await suite.composeSpecs());
    this._emit(RunEvents.SuiteEnd, suiteSummary);
  }

  async _runTest(test) {
    let initialSummary = new SpecSummary(test);

    if (test.skipped) {
      this._emit(RunEvents.TestSkip, initialSummary);
    } else {    
      this._emit(RunEvents.TestStart, initialSummary);
      await test.run();

      let resultSummary = this._summary.addTestResult(test);
      this._emit(RunEvents.TestEnd, resultSummary);
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
      result = await findSpecAtLocation(suiteSpecs, { fileName, lineNumber });
    }

    if (result) break;
  }

  return result;
}
