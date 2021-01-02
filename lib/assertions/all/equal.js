import Assertion from 'assertions/assertion';

export function equal(actual, expected) {
  return new Assertion({
    passed: Object.is(actual, expected),
    operator: 'equal',
    actual,
    expected
  });
}

export function notEqual(actual, expected) {
  let equalAssertion = equal(actual, expected);

  return new Assertion({
    passed: !equalAssertion.passed,
    operator: 'notEqual',
    actual,
    expected
  });
}
