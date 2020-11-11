import Assertion from 'assertions/assertion';

export default function assert(actual) {
  return new Assertion({
    passed: !actual,
    operator: 'refute',
    actual,
    expected: false
  });
}