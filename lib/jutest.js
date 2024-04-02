import { join as joinPath, resolve as resolvePath } from "path";
import glob from "glob";
import { Jutest } from "core";
import { parseFileLocation } from "utils/file-location";
import { TestRunner } from "test-runner";
import { ProgressReporter, SummaryReporter, FailedTestsReporter, ReporterConfig } from 'reporters';

let jutestInstance = new Jutest();

export let jutest = jutestInstance.toPublicAPI();

export async function autoRun({
  paths=process.argv.slice(2),
  defaultTestDir="test",
  testFilesGlob="/**/*-test.*",
  reportersConfig,
}={}) {
  let fileLocations = parseLocations({ paths, defaultTestDir, testFilesGlob });
  let runner = new TestRunner({ fileLocations });

  let reporterClasses = [
    ProgressReporter,
    FailedTestsReporter,
    SummaryReporter,
  ];
  let reporterConfig = new ReporterConfig(reportersConfig);
  let reporters = reporterClasses.map(ReporterClass => {
    let reporter = new ReporterClass(reporterConfig);
    reporter?.registerListeners?.(runner.eventEmitter);
    return reporter;
  });

  let runSummary = await runner.run(jutestInstance);

  for (let reporter of reporters) {
    await reporter?.finishReporting?.([runSummary]);
  }

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
