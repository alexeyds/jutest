import { ProgressReporter } from 'reporters/all';
import requireTestFiles from "require-test-files";
import { Jutest } from "./jutest/jutest";

export let jutest = new Jutest().toPublicAPI();

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

  requireTestFiles({paths, defaultTestDir, testFilesGlob});

  let filesLoadedAt = process.hrtime.bigint();
  let result = await jutest.start(testReporter);
  let finishedAt = process.hrtime.bigint();

  let loadTime = (Number(filesLoadedAt - startedAt) / 1e9).toFixed(2);
  let runTime = (Number(finishedAt - startedAt) / 1e9).toFixed(2);

  console.log(`Finished in ${runTime}s, files took ${loadTime}s to load.`);

  if (!result.success) {
    process.exitCode = 1;
  }
}
