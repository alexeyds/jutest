import createAssertions from 'assertions/create_assertions';

export default function createTest({name, testBody, testSetup}) {
  return async function runTest() {
    try {
      let assigns = await testSetup.runSetups();
      await testBody(createAssertions(), assigns);
      return { passed: true, error: null, testName: name };
    } catch(e) {
      return { passed: false, error: e, testName: name };
    }
  };
}
