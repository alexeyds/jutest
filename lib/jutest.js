import { join as joinPath, resolve as resolvePath } from "path";
import glob from "glob";
import { Jutest } from "core";
import { parseFileLocation } from "utils/file-location";
import { TestRunner, TestRunnerEnums } from "test-runner";
import { ProgressReporter } from 'reporters/progress-reporter';
import { SummaryReporter, FailedTestsReporter, ReporterConfig } from 'reporters';

const { Events } = TestRunnerEnums;

let jutestInstance = new Jutest();

export let jutest = jutestInstance.toPublicAPI();

export async function autoRun({
  paths=process.argv.slice(2),
  defaultTestDir="test",
  testFilesGlob="/**/*-test.*",
  sourceDir=process.cwd(),
  excludeSourceDirs=['node-modules']
}={}) {
  let progressReporter = new ProgressReporter();
  progressReporter.config = { sourceDir, excludeSourceDirs };

  let fileLocations = parseLocations({ paths, defaultTestDir, testFilesGlob });
  let runner = new TestRunner({ fileLocations });

  let { eventEmitter } = runner;
  eventEmitter.on(Events.TestEnd, test => progressReporter.reportTestResult(test));
  eventEmitter.on(Events.TestSkip, test => progressReporter.reportTestResult(test));

  let runSummary = await runner.run(jutestInstance);
  let reporterConfig = new ReporterConfig({ trackedSourcePaths: [sourceDir ], ignoredSourcePaths: excludeSourceDirs });
  let summaryReporter = new SummaryReporter(reporterConfig);
  let failedTestsReporter = new FailedTestsReporter(reporterConfig);

  await progressReporter.finishReporting([runSummary]);
  await failedTestsReporter.finishReporting([runSummary]);
  await summaryReporter.finishReporting([runSummary]);

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
    .map(parseFileLocation);
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

