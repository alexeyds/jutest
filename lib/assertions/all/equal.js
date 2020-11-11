import Assertion from 'assertions/assertion';

export default function equal(actual, expected) {
  return new Assertion({
    passed: Object.is(actual, expected),
    operator: 'equal',
    actual,
    expected
  });
}