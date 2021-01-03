import Assertion from "assertions/assertion";
import assertions from "assertions/all";

export default function createAssertions() {
  let result = {};

  for (let name in assertions) {
    let assertion = assertions[name];

    result[name] = function() {
      return Assertion.ensurePassed(assertion(...arguments));
    };
  }

  return result;
}