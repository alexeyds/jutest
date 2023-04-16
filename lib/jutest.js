import { ProgressReporter } from 'reporters/all';
import requireTestFiles from "require-test-files";

import { TestSuite } from "core/test-suite";
import { TestContext } from "core/test-context";

let result = { success: true };
let suites = [];
let testReporter = new ProgressReporter();

let context = new TestContext();

export default function jutest(suiteName, suiteBody) {
  let suite = new TestSuite(suiteName, suiteBody, { context });
  suites.push(suite);
}

jutest.setup = (...args) => context.addSetup(...args);

jutest.start = async function() {
  let runTests = suites.map(async suite => {
    let tests = await suite.tests;
    await Promise.all(tests.map(async test => {
      let result = await test.run();
      testReporter.reportTestResult(result);
    }));
  });

  await Promise.all(runTests);
  
  await testReporter.reportSummary();
  return result;
};

jutest.autoRun = async function({
  paths=process.argv.slice(2),
  defaultTestDir="test",
  testFilesGlob="/**/*-test.*",
  sourceDir=process.cwd(),
  excludeSourceDirs=['/node-modules']
}={}) {
  let startedAt = process.hrtime.bigint();

  testReporter.config = { sourceDir, excludeSourceDirs };
  requireTestFiles({paths, defaultTestDir, testFilesGlob});

  let filesLoadedAt = process.hrtime.bigint();
  let result = await jutest.start();
  let finishedAt = process.hrtime.bigint();

  let loadTime = (Number(filesLoadedAt - startedAt) / 1e9).toFixed(2);
  let runTime = (Number(finishedAt - startedAt) / 1e9).toFixed(2);

  console.log(`Finished in ${runTime}s, files took ${loadTime}s to load.`);

  if (!result.success) {
    process.exitCode = 1;
  }
};
