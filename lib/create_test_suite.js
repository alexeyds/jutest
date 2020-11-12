import createTest from 'create_test';
import TestSetup from 'test_setup';
import { resolveAsyncFunctionsInOrder, isPromise } from "utils/promise";

export default function createSuite({suiteName, suiteBody, testResults, testSetup}) {
  let tests = [];
  testSetup = (testSetup && testSetup.clone()) || new TestSetup();

  let suite = {
    test(testName, testBody) {
      let runTest = createTest({name: joinTestNames(suiteName, testName), testBody, testSetup});

      tests.push(async () => {
        let result = await runTest();
        testResults.addTestResult(result);
      });
    },
    describe(scopeName, scopeBody) {
      tests.push(createSuite({suiteName: joinTestNames(suiteName, scopeName), suiteBody: scopeBody, testResults, testSetup}));
    },
    ...testSetup.sliceSetupHelpers(), 
  };

  validateNotPromise(suiteBody(suite), { suiteName });

  return async function runSuite() {
    await resolveAsyncFunctionsInOrder(tests);
  };
}

function joinTestNames(name1, name2) {
  return `${name1} ${name2}`;
}

function validateNotPromise(body, { suiteName }) {
  if (isPromise(body)) {
    throw new Error(
      `"${suiteName}" test suite tried to define its body using an async function. ` +
      `This is not supported, consider using s.setup() instead.`
    );
  }
}
