import Assertion from 'assertions/assertion';
import same from 'assertions/all/same';

export default function notSame(actual, expected) {
  let sameAssertion = same(actual, expected);

  return new Assertion({
    passed: !sameAssertion.passed,
    operator: 'notSame',
    actual,
    expected
  });
}