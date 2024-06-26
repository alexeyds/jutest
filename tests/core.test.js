import { strict as assert } from 'assert';
import { Test } from "core/test";
import { TestContext } from "core/test-context";

async function test(name, body) {
  return new Test(name, body, { context: new TestContext() }).run();
}

async function testHasExpectations() {
  let name = 'Test#run() passes expectations object to test body';
  let result = await test(name, t => {
    t.assert(true);
  });

  assert.equal(result.status, Test.ExecutionStatuses.Passed);
  assert.equal(result.error, undefined);
}

async function testHasFailures() {
  let name = 'Test#run supports failing assertions';
  let result = await test(name, t => {
    t.assert(false);
  });

  assert.equal(result.status, Test.ExecutionStatuses.Failed);

  let message = result.error.message;
  assert.equal(typeof message, 'string');
  assert(message.length > 0);
}

async function testAsynchroniouslyRunsTestBody() {
  let result = await test('runTest() works with async {testBody}', async t => {
    t.assert(false);
  });

  assert.equal(result.status, Test.ExecutionStatuses.Failed);
}

testHasExpectations();
testHasFailures();
testAsynchroniouslyRunsTestBody();
