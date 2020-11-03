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

function testHasAssertions() {
  let test = buildTest('Test#run passes assertions to test body', (t) => {
    t.assert(true);
  });
  let result = test.run();

  assert.equal(result.passed, true);
  assert.equal(result.error, null);
}

function testHasFailures() {
  let test = buildTest('Test#run passes assertions to test body', (t) => {
    t.assert(false);
  });
  let result = test.run();

  assert.equal(result.passed, false);
  let error = result.error;
  assert.equal(error.expected, true);
  assert.equal(error.actual, false);
  assert.equal(error.operator, 'assert');
}

testExecutesBody();
testHasAssertions();
testHasFailures();
