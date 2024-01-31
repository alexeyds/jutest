import { tryFunctionCall, matchExecutionResult } from 'assertions/shared/error-matcher';

export function throws(expression, matcher) {
  let executionResult = tryFunctionCall(expression);
  return matchExecutionResult({ executionResult, matcher, operator: 'throws' })
}
