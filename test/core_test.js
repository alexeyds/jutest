import { strict as assert } from 'assert';
import TestSetup from 'test_setup';
import createTest from "create_test";

async function testHasExpectations() {
  let name = 'runTest() passes expectations object to {testBody}';
  let runTest = createTest({
    name,
    testBody: (t) => { t.assert(true); },
    testSetup: new TestSetup()
  });
  let result = await runTest();

  assert.equal(result.passed, true);
  assert.equal(result.error, null);
  assert.equal(result.testName, name);
}

async function testHasFailures() {
  let name = 'runTest() supports failing assertions';
  let runTest = createTest({
    name,
    testBody: (t) => { t.assert(false); },
    testSetup: new TestSetup()
  });
  let result = await runTest();

  assert.equal(result.passed, false);
  assert.equal(result.testName, name);

  assert.notEqual(result.error.details, undefined);
}

async function testAsynchroniouslyRunsTestBody() {
  let runTest = createTest({
    name: 'runTest() works with async {testBody}',
    testBody: async (t) => { t.assert(false); },
    testSetup: new TestSetup()
  });
  let result = await runTest();

  assert.equal(result.passed, false);
}

testHasExpectations();
testHasFailures();
testAsynchroniouslyRunsTestBody();
