import { NegatableFailureMessage, negateMatcher, matcherResult } from 'assertions/shared';
import deepEqual from "deep-equal";

export function same(actual, expected) {
  return matcherResult({
    passed: deepEqual(actual, expected, { strict: true }),
    failureMessage: new NegatableFailureMessage({
      operator: 'same',
      actual,
      expected,
    })
  });
}

export let notSame = negateMatcher(same, { operator: 'notSame' });
