import Assertion from 'assertions/assertion';

export function match(actual, expected) {
  return new Assertion({
    passed: expected.test(actual),
    operator: 'match',
    actual,
    expected
  });
}

export function doesNotMatch(actual, expected) {
  let matchAssertion = match(actual, expected);

  return new Assertion({
    passed: !matchAssertion.passed,
    operator: 'doesNotMatch',
    actual,
    expected
  });
}