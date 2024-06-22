import { shuffleArray } from "utils/shuffle-array";
import { TestRunnerEnums } from "test-runner/enums";

const { Events } = TestRunnerEnums;

export async function runSpecs(specsByFile, runnerContext) {
  let { eventEmitter } = runnerContext;

  for (let file in specsByFile) {
    eventEmitter.emit(Events.FileStart, file);
    await recursivelyRunSpecs(specsByFile[file], runnerContext);
    eventEmitter.emit(Events.FileEnd, file);
  }
}

async function recursivelyRunSpecs(specs, runnerContext) {
  if (runnerContext.randomizeOrder) {
    specs = shuffleArray(specs, { seed: runnerContext.seed, getId: s => s.name });
  }

  for (let spec of specs) {
    if (spec.isASuite) {
      await runSuite(spec, runnerContext);
    } else {
      await runTest(spec, runnerContext);
    }
  }
}

async function runSuite(suite, runnerContext) {
  let { runSummary, eventEmitter } = runnerContext;
  let suiteSummary = runSummary.buildSpecSummary(suite);

  eventEmitter.emit(Events.SuiteStart, suiteSummary);
  await recursivelyRunSpecs(await suite.composeSpecs(), runnerContext);
  eventEmitter.emit(Events.SuiteEnd, suiteSummary);
}

async function runTest(test, runnerContext) {
  let { runSummary, eventEmitter } = runnerContext;

  if (!test.skipped) {
    let initialSummary = runSummary.buildSpecSummary(test);
    eventEmitter.emit(Events.TestStart, initialSummary);
    await test.run();
  }

  let resultSummary = runSummary.addTestResult(test);
  let event = test.skipped ? Events.TestSkip : Events.TestEnd;
  eventEmitter.emit(event, resultSummary);
}
