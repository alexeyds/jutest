import createTest from 'create_test';
import { resolveAsyncFunctionsInOrder } from "utils/promise";

export default function createSuite({suiteName, suiteBody, testResults}) {
  let tests = [];

  let suite = {
    test(testName, testBody) {
      let runTest = createTest({name: joinTestNames(suiteName, testName), testBody});

      tests.push(async () => {
        let result = await runTest();
        testResults.addTestResult(result);
      });
    },
    describe(scopeName, scopeBody) {
      tests.push(createSuite({suiteName: joinTestNames(suiteName, scopeName), suiteBody: scopeBody, testResults}));
    }
  };

  suiteBody(suite);

  return async function runSuite() {
    await resolveAsyncFunctionsInOrder(tests);
  };
}

function joinTestNames(name1, name2) {
  return `${name1} ${name2}`;
}
