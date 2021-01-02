import Assertion from 'assertions/assertion';

export function assert(actual) {
  return Assertion.create({
    passed: !!actual,
    operator: 'assert',
    actual,
    expected: true
  });
}

export function refute(actual) {
  return Assertion.create({
    passed: !actual,
    operator: 'refute',
    actual,
    expected: false
  });
}