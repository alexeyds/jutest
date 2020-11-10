import { strict as assert } from 'assert';
import Test from "test";

function buildTest(name, body) {
  return new Test({name, body});
}

async function testExecutesBody() {
  let wasTestExecuted = false;
  let test = buildTest('Test#run executes test body', () => { 
    wasTestExecuted = true; 
  });

  await test.run();
  assert.equal(wasTestExecuted, true);
}

async function testHasExpectations() {
  let name = 'Test#run passes expectations object to test body';
  let test = buildTest(name, (t) => {
    t.assert(true);
  });
  let result = await test.run();

  assert.equal(result.passed, true);
  assert.equal(result.error, null);
  assert.equal(result.testName, name);
}

async function testHasFailures() {
  let name = 'Test#run can fail';
  let test = buildTest(name, (t) => {
    t.assert(false);
  });
  let result = await test.run();

  assert.equal(result.passed, false);
  assert.equal(result.testName, name);

  let error = result.error;
  assert.equal(error.expected, true);
  assert.equal(error.actual, false);
  assert.equal(error.operator, 'assert');
}

async function testAsynchroniouslyRunsTestBody() {
  let test = buildTest('Test#run works with async test bodies', async (t) => {
    t.assert(false);
  });
  let result = await test.run();

  assert.equal(result.passed, false);
}

testExecutesBody();
testHasExpectations();
testHasFailures();
testAsynchroniouslyRunsTestBody();