import Assertion from 'assertions/assertion';

export default function notEqual(actual, expected) {
  return new Assertion({
    passed: !Object.is(actual, expected),
    operator: 'notEqual',
    actual,
    expected
  });
}
