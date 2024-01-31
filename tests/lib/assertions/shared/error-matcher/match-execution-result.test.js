import { jutest } from 'jutest';
import { tryFunctionCall, tryPromiseResolution, matchExecutionResult } from "assertions/shared/error-matcher";

jutest('assertions/matchers/throws', s => {
  s.describe("tryFunctionCall()", s => {
    s.test("returns success if function was executed", t => {
      let result = tryFunctionCall(() => 1);

      t.equal(result.success, true);
      t.equal(result.returnValue, 1);
      t.equal(result.error, null);
      t.equal(result.isAPromise, false);
    });

    s.test("returns failure if function had thrown an error", t => {
      let error = new Error('test');
      let result = tryFunctionCall(() => { throw error; });

      t.equal(result.success, false);
      t.equal(result.returnValue, undefined);
      t.equal(result.error, error);
      t.equal(result.isAPromise, false);
    });
  });

  s.describe("tryPromiseResolution()", s => {
    s.test("returns success if promise resolved successfully", async t => {
      let result = await tryPromiseResolution(Promise.resolve(1));

      t.equal(result.success, true);
      t.equal(result.returnValue, 1);
      t.equal(result.error, null);
      t.equal(result.isAPromise, true);
    });

    s.test("returns failure if promise raises an error", async t => {
      let error = new Error('test');
      let result = await tryPromiseResolution(Promise.reject(error));

      t.equal(result.success, false);
      t.equal(result.returnValue, undefined);
      t.equal(result.error, error);
      t.equal(result.isAPromise, true);
    });
  });

  s.describe('matchExecutionResult()', s => {
    s.test('passes if provided execution result has an error', t => {
      let executionResult = tryFunctionCall(() => { throw 'foobar' })
      let result = matchExecutionResult({ executionResult, matcher: 'foobar', operator: 'throws' });

      t.equal(result.passed, true);
    });

    s.test('fails if provided expression doesnt throw', t => {
      let executionResult = tryFunctionCall(() => { })
      let result = matchExecutionResult({ executionResult, matcher: Error, operator: 'throws' });

      t.equal(result.passed, false);
      t.match(result.failureMessage, /throws/);
    });

    s.test("fails if error doesn't match the expectation", t => {
      let executionResult = tryFunctionCall(() => { throw Error('baz') })
      let result = matchExecutionResult({ executionResult, matcher: 'bar', operator: 'throws' });

      t.match(result.failureMessage, /baz/);
      t.match(result.failureMessage, /throws/);
    });

    s.test("supports promise execution result", async t => {
      let executionResult = await tryPromiseResolution(Promise.reject(new Error('baz')));
      let result = matchExecutionResult({ executionResult, matcher: 'bar', operator: 'rejects' });

      t.match(result.failureMessage, /baz/);
      t.match(result.failureMessage, /rejects/);
    });
  });
});
