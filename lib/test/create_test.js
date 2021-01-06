import createAssertions from 'test/create_assertions';

export default function createTest({name, testBody, testSetup}) {
  return async function runTest() {
    let testResult;
    let assertions = createAssertions();

    try {
      let assigns = await testSetup.runSetups();
      await testBody(assertions, assigns);
      await testSetup.runBeforeTestEndCallbacks(assertions, assigns);

      testResult = { passed: true, error: null, testName: name };
    } catch(e) {
      testResult = { passed: false, error: e, testName: name };
    }

    await testSetup.runTeardowns();

    return testResult;
  };
}
