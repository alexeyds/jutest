import { tryPromiseResolution, matchExecutionResult } from 'assertions/shared/error-matcher';

export async function rejects(promise, matcher) {
  let executionResult = await tryPromiseResolution(promise);
  return matchExecutionResult({ executionResult, matcher, operator: 'rejects' });
}
