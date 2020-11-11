import Assertion from 'assertions/assertion';

export default function assert(actual) {
  let expected = true;

  return new Assertion({
    passed: actual === expected,
    operator: 'assert',
    actual,
    expected
  });
}