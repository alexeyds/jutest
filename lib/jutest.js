import { Runtime, RuntimeEvents } from "runtime";
import { ProgressReporter } from 'reporters/progress-reporter';
import requireTestFiles from "require-test-files";

let runtime = new Runtime();

export let { jutest } = runtime;

export async function autoRun({
  paths=process.argv.slice(2),
  defaultTestDir="test",
  testFilesGlob="/**/*-test.*",
  sourceDir=process.cwd(),
  excludeSourceDirs=['/node-modules']
}={}) {
  let startedAt = process.hrtime.bigint();

  let { eventEmitter, runner } = runtime;

  let testReporter = new ProgressReporter();
  testReporter.config = { sourceDir, excludeSourceDirs };

  eventEmitter.on(RuntimeEvents.TestEnd, test => testReporter.reportTestResult(test));
  eventEmitter.on(RuntimeEvents.TestSkip, test => testReporter.reportTestResult(test));
  eventEmitter.on(RuntimeEvents.RunEnd, runSummary => testReporter.reportSummary(runSummary));

  let fileWithLocation = parseLocation(paths);
  let pathsToRun = fileWithLocation ? [fileWithLocation.fileName] : paths;
  requireTestFiles({paths: pathsToRun, defaultTestDir, testFilesGlob});

  let filesLoadedAt = process.hrtime.bigint();

  let runSummary;

  if (fileWithLocation) {
    runSummary = await runner.runAtFileLocation(fileWithLocation);
  } else {
    runSummary = await runner.runAll();
  }

  let finishedAt = process.hrtime.bigint();

  let loadTime = (Number(filesLoadedAt - startedAt) / 1e9).toFixed(2);
  let runTime = (Number(finishedAt - startedAt) / 1e9).toFixed(2);

  console.log(`Finished in ${runTime}s, test files took ${loadTime}s to load.`);

  if (!runSummary.success) {
    process.exitCode = 1;
  }
}

function parseLocation(paths) {
  let location = paths.find(() => /:\d+^/);

  if (location) {
    if (paths.length > 1) {
      throw new Error('Running multiple files when one of them includes a line number modifier is currently not supported.');
    }

    let [fileName, lineNumber] = location.split(':');
    return { fileName, lineNumber: parseInt(lineNumber) };
  }
}
