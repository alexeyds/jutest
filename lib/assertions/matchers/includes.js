import { NegatableFailureMessage, negateMatcher } from 'assertions/shared';

export function includes(actual, expected) {
  return {
    passed: actual.includes(expected),
    failureMessage: new NegatableFailureMessage({
      operator: 'includes',
      actual,
      expected,
    })
  };
}

export let excludes = negateMatcher(includes, { operator: "excludes" });
