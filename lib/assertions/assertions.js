import { same, notSame } from "./matchers/same";
import { match, doesNotMatch } from "./matchers/match";
import { fail } from "./matchers/fail";
import { equal, notEqual } from "./matchers/equal";
import { assert, refute } from "./matchers/assert";
import { throws } from "./matchers/throws";
import { passesEventually, rejects } from "./matchers/async";
import { nameFunction } from "utils/function";
import { AssertionFailedError } from "./shared";

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
  throws,
];

const ASYNC_MATCHERS = [
  passesEventually,
  rejects,
];

export { AssertionFailedError };

export class JutestAssertions {
  constructor() {
    this.async = {};

    MATCHERS.forEach(matcher => {
      this[matcher.name] = createSyncAssertion(matcher);
    });

    ASYNC_MATCHERS.forEach(matcher => {
      this.async[matcher.name] = createAsyncAssertion(matcher);
    });
  }
}

function createSyncAssertion(matcher) {
  return createNamedAssertion((...args) => {
    handleAssertionResult(matcher(...args));
  }, matcher);
}

function createAsyncAssertion(matcher) {
  return createNamedAssertion(async (...args) => {
    handleAssertionResult(await matcher(...args));
  }, matcher);
}

function createNamedAssertion(assertion, matcher) {
  nameFunction(assertion, matcher.name);
  return assertion;
}

function handleAssertionResult(result) {
  if (!result.passed) {
    throw new AssertionFailedError(result.failureMessage);
  }
}
