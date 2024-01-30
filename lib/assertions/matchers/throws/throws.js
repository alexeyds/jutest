import { tryFunctionCall, doesErrorMatch } from "./utils";
import { noErrorThrownMessage, wrongErrorThrownMessage } from "./failure-messages";
import { success, failure } from 'assertions/shared';

export function throws(expression, matcher) {
  let { success: noErrorThrown, error } = tryFunctionCall(expression);

  if (noErrorThrown) {
    return failure(noErrorThrownMessage({ expected: matcher }));
  } else if (doesErrorMatch(error, matcher)) {
    return success();
  } else {
    return failure(wrongErrorThrownMessage({
      expected: matcher,
      actual: error
    }));
  }
}
