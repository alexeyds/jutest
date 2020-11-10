import createTest from 'create_test';
import ProgressReporter from 'reporters/progress_reporter';

let tests = [];

export default function jutest(suiteName, suiteBody) {
  let suite = {
    test(testName, testBody) {
      let name = `${suiteName} ${testName}`;
      tests.push(createTest({name, testBody}));
    }
  };

  suiteBody(suite);
}

jutest.start = async () => {
  let testReporter = new ProgressReporter();
  let wrappedTests = tests.map(t => wrapInTestReporter(t, testReporter));
  await Promise.all(wrappedTests.map(t => t()));

  testReporter.reportSummary();
};

function wrapInTestReporter(test, testReporter) {
  return async function() {
    let result = await test();
    testReporter.reportTestResult(result);
  };
}
