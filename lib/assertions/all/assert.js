import Assertion from 'assertions/assertion';

export default function assert(actual) {
  return new Assertion({
    passed: !!actual,
    operator: 'assert',
    actual,
    expected: true
  });
}