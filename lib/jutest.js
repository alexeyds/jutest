import TestResults from 'test_results';
import TestSetup from 'test_setup';
import createSuite from 'create_test_suite';
import ProgressReporter from 'progress_reporter';
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

jutest.start = async () => {
  await resolveAsyncFunctionsInOrder(suites);
  testReporter.reportSummary();
  return result;
};
