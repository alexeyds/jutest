import { Jutest, SpecsContainer } from "core";
import { TestRunner } from "runtime";
import { ProgressReporter } from 'reporters/progress-reporter';
import requireTestFiles from "require-test-files";

let specsContainer = new SpecsContainer();
let testRunner = new TestRunner({ specsContainer });

export let jutest = new Jutest({ specsContainer }).toPublicAPI();

export async function autoRun({
  paths=process.argv.slice(2),
  defaultTestDir="test",
  testFilesGlob="/**/*-test.*",
  sourceDir=process.cwd(),
  excludeSourceDirs=['/node-modules']
}={}) {
  let startedAt = process.hrtime.bigint();

  let testReporter = new ProgressReporter();
  testReporter.config = { sourceDir, excludeSourceDirs };

  testRunner.on('test-end', test => testReporter.reportCompletedTest(test));
  testRunner.on('run-end', () => testReporter.reportSummary());

  let fileWithLocation = parseLocation(paths);
  let pathsToRun = fileWithLocation ? [fileWithLocation.fileName] : paths;
  requireTestFiles({paths: pathsToRun, defaultTestDir, testFilesGlob});

  let filesLoadedAt = process.hrtime.bigint();

  let runSummary;

  if (fileWithLocation) {
    runSummary = await testRunner.runAtFileLocation(fileWithLocation);
  } else {
    runSummary = await testRunner.runAll();
  }

  let finishedAt = process.hrtime.bigint();

  let loadTime = (Number(filesLoadedAt - startedAt) / 1e9).toFixed(2);
  let runTime = (Number(finishedAt - startedAt) / 1e9).toFixed(2);

  console.log(`Finished in ${runTime}s, test files took ${loadTime}s to load.`);

  if (runSummary.failedTestsCount !== 0) {
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
