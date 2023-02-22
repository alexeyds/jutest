import createAssertions from 'test/create-assertions';
import TestResult from "test/test-result";

export default function createTest({name: testName, testBody, testSetup}) {
  return async function runTest() {
    let testResult;
    let assertions = createAssertions();

    try {
      let assigns = await testSetup.runSetups();
      await testBody(assertions, assigns);
      await testSetup.runBeforeTestEndCallbacks(assertions, assigns);

      testResult = TestResult.passed({testName});
    } catch(error) {
      testResult = TestResult.errored({testName, error});
    }

    await testSetup.runTeardowns();

    return testResult;
  };
}
