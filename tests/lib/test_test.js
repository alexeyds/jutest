import { strict as assert } from 'assert';
import Test from "test";

function buildTest(name, body) {
  return new Test({name, body});
}

function testExecutesBody() {
  let wasTestExecuted = false;
  let test = buildTest('Test#run executes test body', () => { 
    wasTestExecuted = true; 
  });

  test.run();
  assert.equal(wasTestExecuted, true);
}

function testHasExpectations() {
  let name = 'Test#run passes expectations object to test body';
  let test = buildTest(name, (t) => {
    t.assert(true);
  });
  let result = test.run();

  assert.equal(result.passed, true);
  assert.equal(result.error, null);
  assert.equal(result.testName, name);
}

function testHasFailures() {
  let name = 'Test#run can fail';
  let test = buildTest(name, (t) => {
    t.assert(false);
  });
  let result = test.run();

  assert.equal(result.passed, false);
  assert.equal(result.testName, name);

  let error = result.error;
  assert.equal(error.expected, true);
  assert.equal(error.actual, false);
  assert.equal(error.operator, 'assert');
}

testExecutesBody();
testHasExpectations();
testHasFailures();
