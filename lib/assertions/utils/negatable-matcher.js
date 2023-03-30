import { assertionFailedMessage, negationFailedMessage } from "assertions/utils/failure-messages";
import { nameFunction } from "utils/function";

export class NegatableFailureMessage {
  constructor({ operator, expected, actual, negated=false }) {
    this.operator = operator;
    this.expected = expected;
    this.actual = actual;
    this.negated = negated;
  }

  toString() {
    if (this.negated) {
      return negationFailedMessage(this);
    } else {
      return assertionFailedMessage(this);
    }
  }

  negate({ operator }) {
    return new NegatableFailureMessage({ ...this, operator, negated: true });
  }
}

export function negateMatcher(matcher, { operator }) {
  let negatedMatcher = (...args) => {
    let result = matcher(...args);

    return {
      passed: !result.passed,
      failureMessage: result.failureMessage.negate({ operator })
    };
  };

  nameFunction(negatedMatcher, operator);

  return negatedMatcher;
}
