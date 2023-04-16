import { strict as assert } from 'assert';
import { Test } from "test";
import { TestContext } from "test-context";

async function test(name, body) {
  return new Test(name, body, { context: new TestContext() }).run();
}

async function testHasExpectations() {
  let name = 'Test#run() passes expectations object to test body';
  let result = await test(name, t => {
    t.assert(true);
  });

  assert.equal(result.passed, true);
  assert.equal(result.error, null);
  assert.equal(result.testName, name);
}

async function testHasFailures() {
  let name = 'Test#run supports failing assertions';
  let result = await test(name, t => {
    t.assert(false);
  });

  assert.equal(result.passed, false);
  assert.equal(result.testName, name);

  let message = result.error.message;
  assert.equal(typeof message, 'string');
  assert(message.length > 0);
}

async function testAsynchroniouslyRunsTestBody() {
  let result = await test('runTest() works with async {testBody}', async t => {
    t.assert(false);
  });

  assert.equal(result.passed, false);
}

testHasExpectations();
testHasFailures();
testAsynchroniouslyRunsTestBody();
