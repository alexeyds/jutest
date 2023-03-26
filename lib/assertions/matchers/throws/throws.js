import { tryFunctionCall, doesErrorMatch } from "./utils";
import { noErrorThrownMessage, wrongErrorThrownMessage } from "./failure-messages";

export function throws(expression, matcher) {
  let { success, error } = tryFunctionCall(expression);

  if (success) {
    return {
      passed: false,
      failureMessage: noErrorThrownMessage({ expected: matcher })
    };
  }

  let passed = doesErrorMatch(error, matcher);
  let result = { passed };


  if (!passed) {
    result.failureMessage = wrongErrorThrownMessage({ expected: matcher, actual: error });
  }

  return result;
}
