import { join as joinPath, resolve as resolvePath } from "path";
import glob from "glob";
import { Jutest } from "core";
import { TestRunner, TestRunnerEnums } from "test-runner";
import { ProgressReporter } from 'reporters/progress-reporter';

const { Events } = TestRunnerEnums;

let jutestInstance = new Jutest();

export let jutest = jutestInstance.toPublicAPI();

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

  let fileLocations = parseLocations({ paths, defaultTestDir, testFilesGlob });
  let runner = new TestRunner({ fileLocations });

  let { eventEmitter } = runner;
  eventEmitter.on(Events.TestEnd, test => testReporter.reportTestResult(test));
  eventEmitter.on(Events.TestSkip, test => testReporter.reportTestResult(test));

  let runSummary = await runner.run(jutestInstance);

  await testReporter.reportSummary(runSummary);

  let loadTime = runSummary.fileLoadTimes.reduce((sum, item) => sum + item.loadTime, 0);
  console.log(`Finished in ${toSeconds(runSummary.runTime)}s, test files took ${toSeconds(loadTime)}s to load.`);

  if (!runSummary.success) {
    process.exitCode = 1;
  }
}

function parseLocations({ paths, defaultTestDir, testFilesGlob }) {
  if (paths.length === 0) {
    paths = [defaultTestDir];
  }

  return paths
    .map(p => findTestFiles(p, { testFilesGlob }))
    .flat()
    .map(p => resolvePath(process.cwd(), p))
    .map(parseLocation)
}

function findTestFiles(path, { testFilesGlob }) {
  if (isFile(path)) {
    return path;
  } else {
    let folder = joinPath(path, testFilesGlob);
    return glob.sync(folder);
  }
}

function isFile(path) {
  return /\..+$/.test(path);
}

function parseLocation(path) {
  if (/:\d+^/.test(path)) {
    let [file, lineNumber] = location.split(':');
    return { file, lineNumber };
  } else {
    return { file: path }
  }
}

function toSeconds(time) {
  return ((time % 60000) / 1000).toFixed(2);
}
