import { NegatableFailureMessage, negateMatcher } from 'assertions/utils/negatable-matcher';
import deepEqual from "deep-equal";

export function same(actual, expected) {
  return {
    passed: deepEqual(actual, expected, { strict: true }),
    failureMessage: new NegatableFailureMessage({
      operator: 'same',
      actual,
      expected,
    })
  };
}

export let notSame = negateMatcher(same, { operator: 'notSame' });
