import Assertion from 'assertions/assertion';

export function equal(actual, expected) {
  return Assertion.create({
    passed: Object.is(actual, expected),
    operator: 'equal',
    actual,
    expected
  });
}

export function notEqual() {
  return Assertion.negate(equal(...arguments), { operator: 'notEqual' });
}
