import Assertion from 'assertions/assertion';

export function match(actual, expected) {
  return Assertion.create({
    passed: expected.test(actual),
    operator: 'match',
    actual,
    expected
  });
}

export function doesNotMatch() {
  return Assertion.negate(match(...arguments), { operator: 'doesNotMatch' });
}