import { same, notSame } from "./matchers/same";
import { match, doesNotMatch } from "./matchers/match";
import { fail } from "./matchers/fail";
import { equal, notEqual } from "./matchers/equal";
import { assert, refute } from "./matchers/assert";
import { throws } from "./matchers/throws";
import { nameFunction } from "utils/function";

const MATCHERS = [
  same,
  notSame,
  match,
  doesNotMatch,
  fail,
  equal,
  notEqual,
  assert,
  refute,
  throws
];

export class AssertionFailedError extends Error {
  constructor() {
    super(...arguments);
    this.name = 'AssertionFailedError';
  }
}

export class JutestAssertions {
  constructor() {
    MATCHERS.forEach(matcher => {
      this[matcher.name] = createAssertion(matcher);
    });
  }
}

function createAssertion(matcher) {
  let assertion = (...args) => {
    let result = matcher(...args);

    if (!result.passed) {
      throw new AssertionFailedError(result.failureMessage);
    }
  };

  nameFunction(assertion, matcher.name);

  return assertion;
}
