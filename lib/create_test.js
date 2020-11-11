import createAssertions from 'assertions/create_assertions';

export default function createTest({name, testBody}) {
  return async function runTest() {
    try {
      await testBody(createAssertions());
      return { passed: true, error: null, testName: name };
    } catch(e) {
      return { passed: false, error: e, testName: name };
    }
  };
}
