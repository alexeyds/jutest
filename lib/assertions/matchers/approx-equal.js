import { NegatableFailureMessage, negateMatcher } from 'assertions/shared';
import { isApproxEqual } from "assertions/shared/equality-checks";

export function approxEqual(actual, expected, opts) {
  return {
    passed: isApproxEqual(actual, expected, opts),
    failureMessage: new NegatableFailureMessage({
      operator: 'approxEqual',
      actual,
      expected,
    })
  };
}

export let notApproxEqual = negateMatcher(approxEqual, { operator: 'notApproxEqual'} );
