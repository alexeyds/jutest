import { RuntimeEvents, ExitReasons } from "runtime/enums";
import { SpecSummary } from "./spec-summary";
import { TestRunSummary } from "./test-run-summary";

export class TestRunner {
  constructor(runtimeContext) {
    this._runtimeContext = runtimeContext;
    this._summary = new TestRunSummary();
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
    this._emit(RuntimeEvents.RunStart);

    await this._runSpecs(specs);

    this._summary.endRun({ exitReason: ExitReasons.RunEnd });

    let runSummary = this._summary.toObject();
    this._emit(RuntimeEvents.RunEnd, runSummary);

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

    this._emit(RuntimeEvents.SuiteStart, suiteSummary);
    await this._runSpecs(await suite.composeSpecs());
    this._emit(RuntimeEvents.SuiteEnd, suiteSummary);
  }

  async _runTest(test) {
    let initialSummary = new SpecSummary(test);

    if (test.skipped) {
      this._emit(RuntimeEvents.TestSkip, initialSummary);
    } else {    
      this._emit(RuntimeEvents.TestStart, initialSummary);
      await test.run();

      let resultSummary = this._summary.addTestResult(test);
      this._emit(RuntimeEvents.TestEnd, resultSummary);
    }
  }

  get _allSpecs() {
    return this._runtimeContext.specsContainer.specs;
  }

  _emit(...args) {
    return this._runtimeContext.eventEmitter.emit(...args);
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
