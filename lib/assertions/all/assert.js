import Assertion from 'assertions/assertion';

export function assert(actual) {
  return new Assertion({
    passed: !!actual,
    operator: 'assert',
    actual,
    expected: true
  });
}

export function refute(actual) {
  let assertAssertion = assert(actual);

  return new Assertion({
    passed: !assertAssertion.passed,
    operator: 'refute',
    actual,
    expected: false
  });
}