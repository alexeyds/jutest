import Assertion from 'assertions/assertion';

export default function assert(actual) {
  let expected = false;

  return new Assertion({
    passed: actual === expected,
    operator: 'refute',
    actual,
    expected
  });
}