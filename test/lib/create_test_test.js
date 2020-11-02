import createTest from 'create_test';
import { strict as assert } from 'assert';

function runnerTest() {
  let wasRun = false;
  let test = createTest('Tests have #run method', () => { wasRun = true; });

  assert.equal(test.name, 'Tests have #run method');
  test.run();
  assert.equal(wasRun, true);
}

function testResultTest() {
  let test = createTest('Tests return TestResult', () => { });

  let { assertions, failedAssertions, passed } = test.run();

  assert.deepEqual(failedAssertions, []);
  assert.deepEqual(assertions, []);
  assert.equal(passed, true);
}

function passedAssertionTest() {
  let test = createTest('Tests have #assert assertion', t => {
    t.assert(true);
  });

  let { assertions, failedAssertions, passed } = test.run();

  assert.equal(assertions.length, 1);
  assert.equal(failedAssertions.length, 0);
  assert.equal(passed, true);

  let assertion = assertions[0];
  assert.equal(assertion.passed, true);
  assert.equal(assertion.expected, true);
  assert.equal(assertion.actual, true);
  assert.equal(assertion.operator, 'assert');
}

function failedAssertionTest() {
  let test = createTest("Tests can handle assertion's failure", t => {
    t.assert(false);
  });

  let { assertions, failedAssertions, passed } = test.run();

  assert.equal(assertions.length, 1);
  assert.equal(failedAssertions.length, 1);
  assert.equal(passed, false);

  let assertion = assertions[0];
  assert.equal(assertion.passed, false);
  assert.equal(assertion.expected, true);
  assert.equal(assertion.actual, false);
  assert.equal(failedAssertions[0], assertion);
}

runnerTest();
testResultTest();
passedAssertionTest();
failedAssertionTest();
