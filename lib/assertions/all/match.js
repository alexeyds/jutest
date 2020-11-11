import Assertion from 'assertions/assertion';

export default function match(actual, expected) {
  return new Assertion({
    passed: expected.test(actual),
    operator: 'match',
    actual,
    expected
  });
}
