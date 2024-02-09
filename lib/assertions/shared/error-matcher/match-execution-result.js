import {  doesErrorMatch } from "./does-error-match";
import { noErrorThrownMessage, wrongErrorThrownMessage } from "./failure-messages";
import { success, failure } from 'assertions/shared';

export function matchExecutionResult({ executionResult, operator, matcher }) {
  let { success: noErrorThrown, error, isAPromise } = executionResult;

  if (noErrorThrown) {
    return failure(noErrorThrownMessage({ expected: matcher, operator, isAPromise }));
  } else if (doesErrorMatch(error, matcher)) {
    return success();
  } else {
    return failure(wrongErrorThrownMessage({
      expected: matcher,
      actual: error,
      operator,
    }));
  }
}

export function tryFunctionCall(func) {
  try {
    let returnValue = func();
    return executionSuccess({ returnValue, isAPromise: false });
  } catch(error) {
    return executionFailure({ error, isAPromise: false });
  }
}

export async function tryPromiseResolution(promise) {
  try {
    let returnValue = await promise;
    return executionSuccess({ returnValue, isAPromise: true });
  } catch(error) {
    return executionFailure({ error, isAPromise: true });
  }

}

function executionSuccess({  returnValue, isAPromise }) {
  return {
    success: true,
    returnValue,
    error: null,
    isAPromise,
  };
}

function executionFailure({ error, isAPromise }) {
  return {
    success: false,
    returnValue: undefined,
    error,
    isAPromise,
  };
}
