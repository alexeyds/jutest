import { NegatableFailureMessage, negateMatcher, matcherResult } from 'assertions/shared';
import { isSame } from "assertions/shared/equality-checks";

export function same(actual, expected) {
  return matcherResult({
    passed: isSame(actual, expected),
    failureMessage: new NegatableFailureMessage({
      operator: 'same',
      actual,
      expected,
    })
  });
}

export let notSame = negateMatcher(same, { operator: 'notSame' });
