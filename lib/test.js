import Expectations from 'expectations';

export function createTest({name, testBody}) {
  return async function runTest() {
    try {
      await testBody(Expectations);
      return { passed: true, error: null, testName: name };
    } catch(e) {
      return { passed: false, error: e, testName: name };
    }
  };
}
