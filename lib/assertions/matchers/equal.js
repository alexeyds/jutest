import { NegatableFailureMessage, negateMatcher } from 'assertions/shared';
import { isEqual } from "assertions/shared/equality-checks";

export function equal(actual, expected) {
  return {
    passed: isEqual(actual, expected),
    failureMessage: new NegatableFailureMessage({
      operator: 'equal',
      actual,
      expected,
    })
  };
}

export let notEqual = negateMatcher(equal, { operator: 'notEqual'} );
