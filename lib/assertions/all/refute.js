import Assertion from 'assertions/assertion';
import assert from 'assertions/all/assert';

export default function refute(actual) {
  let assertAssertion = assert(actual);

  return new Assertion({
    passed: !assertAssertion.passed,
    operator: 'refute',
    actual,
    expected: false
  });
}