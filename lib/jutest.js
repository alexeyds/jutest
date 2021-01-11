import TestResults from 'test_results';
import TestSetup from 'test_setup';
import createSuite from 'create_test_suite';
import ProgressReporter from 'progress_reporter';
import requireTestFiles from "require_test_files";
import { resolveAsyncFunctionsInOrder } from 'utils/promise';

let result = { success: true };
let suites = [];
let testReporter = new ProgressReporter();
let testResults = new TestResults({
  onSingleTestResult: r => {
    if (!r.passed) result.success = false;
    testReporter.reportTestResult(r);
  }
});
let testSetup = new TestSetup();

export default function jutest(suiteName, suiteBody) {
  let suite = createSuite({suiteName, suiteBody, testResults, testSetup});
  suites.push(suite);
}

let testSetupHelpers = testSetup.sliceSetupHelpers();
for (let k in testSetupHelpers) {
  jutest[k] = testSetupHelpers[k];
}

jutest.start = async function() {
  await resolveAsyncFunctionsInOrder(suites);
  testReporter.reportSummary();
  return result;
};

jutest.autoRun = async function({
  paths=process.argv.slice(2),
  defaultTestDir="test",
  testFilesGlob="/**/*_test.*"
}={}) {
  requireTestFiles({paths, defaultTestDir, testFilesGlob});

  let result = await jutest.start();
  if (!result.success) {
    process.exitCode = 1;
  }
};
