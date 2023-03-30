import { NegatableFailureMessage, negateMatcher } from 'assertions/utils/negatable-matcher';

export function match(actual, expected) {
  expected = new RegExp(expected);

  return {
    passed: expected.test(actual),
    failureMessage: new NegatableFailureMessage({
      operator: 'match',
      actual,
      expected,
    })
  };
}

export let doesNotMatch = negateMatcher(match, { operator: "doesNotMatch" });
