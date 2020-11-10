import { strict as assert } from 'assert';
import { createTest } from "test";

async function testHasExpectations() {
  let name = 'Test#run passes expectations object to test body';
  let runTest = createTest({
    name,
    testBody: (t) => { t.assert(true); }
  });
  let result = await runTest();

  assert.equal(result.passed, true);
  assert.equal(result.error, null);
  assert.equal(result.testName, name);
}

async function testHasFailures() {
  let name = 'Test#run can fail';
  let runTest = createTest({
    name,
    testBody: (t) => { t.assert(false); }
  });
  let result = await runTest();

  assert.equal(result.passed, false);
  assert.equal(result.testName, name);

  let error = result.error;
  assert.equal(error.expected, true);
  assert.equal(error.actual, false);
  assert.equal(error.operator, 'assert');
}

async function testAsynchroniouslyRunsTestBody() {
  let runTest = createTest({
    name: 'Test#run works with async test bodies',
    testBody: async (t) => { t.assert(false); }
  });
  let result = await runTest();

  assert.equal(result.passed, false);
}

testHasExpectations();
testHasFailures();
testAsynchroniouslyRunsTestBody();
