import TestResults from 'test_results';
import createSuite from 'create_test_suite';
import ProgressReporter from 'progress_reporter';
import { resolveAsyncFunctionsInOrder } from 'utils/promise';

let suites = [];
let testReporter = new ProgressReporter();
let testResults = new TestResults({onSingleTestResult: r => testReporter.reportTestResult(r)});

export default function jutest(suiteName, suiteBody) {
  let suite = createSuite({suiteName, suiteBody, testResults});
  suites.push(suite);
}

jutest.start = async () => {
  await resolveAsyncFunctionsInOrder(suites);
  testReporter.reportSummary();
};
