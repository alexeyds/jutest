import AssertionError from "assertions/assertion_error";
import assertions from "assertions/all";

export default function createAssertions() {
  let result = {};

  for (let name in assertions) {
    let assertion = assertions[name];

    result[name] = function() {
      let assertionResult = assertion(...arguments);

      if (assertionResult.passed) {
        return true;
      } else {
        throw new AssertionError(assertionResult);
      }
    };
  }

  return result;
}