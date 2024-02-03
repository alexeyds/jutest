import { Jutest, TestsContainer } from "core";
import { TestRunner } from "runtime";
import { ProgressReporter } from 'reporters/progress-reporter';
import requireTestFiles from "require-test-files";

let testsContainer = new TestsContainer();
export let jutest = new Jutest({ testsContainer }).toPublicAPI();
export let testRunner = new TestRunner({ testsContainer });

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

  requireTestFiles({paths, defaultTestDir, testFilesGlob});

  let filesLoadedAt = process.hrtime.bigint();
  let result = await testRunner.run();
  let finishedAt = process.hrtime.bigint();

  let loadTime = (Number(filesLoadedAt - startedAt) / 1e9).toFixed(2);
  let runTime = (Number(finishedAt - startedAt) / 1e9).toFixed(2);

  console.log(`Finished in ${runTime}s, files took ${loadTime}s to load.`);

  if (!result.allTestsPassed) {
    process.exitCode = 1;
  }
}
