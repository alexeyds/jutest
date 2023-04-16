import { NegatableFailureMessage, negateMatcher } from 'assertions/utils/negatable-matcher';

export function equal(actual, expected) {
  return {
    passed: Object.is(actual, expected),
    failureMessage: new NegatableFailureMessage({
      operator: 'equal',
      actual,
      expected,
    })
  };
}

export let notEqual = negateMatcher(equal, { operator: 'notEqual'} );
