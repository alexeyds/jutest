import Assertion from 'assertions/assertion';
import deepEqual from "deep-equal";

export function same(actual, expected) {
  return new Assertion({
    passed: deepEqual(actual, expected, {strict: true}),
    operator: 'same',
    actual,
    expected
  });
}

export function notSame(actual, expected) {
  let sameAssertion = same(actual, expected);

  return new Assertion({
    passed: !sameAssertion.passed,
    operator: 'notSame',
    actual,
    expected
  });
}