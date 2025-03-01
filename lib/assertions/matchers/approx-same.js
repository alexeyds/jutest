import { NegatableFailureMessage, negateMatcher } from 'assertions/shared';
import { isApproxSame } from "assertions/shared/equality-checks";

export function approxSame(actual, expected, opts) {
  return {
    passed: isApproxSame(actual, expected, opts),
    failureMessage: new NegatableFailureMessage({
      operator: 'approxSame',
      actual,
      expected,
    })
  };
}

export let notApproxSame = negateMatcher(approxSame, { operator: 'notApproxSame'} );
