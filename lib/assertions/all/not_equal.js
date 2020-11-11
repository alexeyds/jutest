import Assertion from 'assertions/assertion';
import equal from 'assertions/all/equal';

export default function notEqual(actual, expected) {
  let equalAssertion = equal(actual, expected);

  return new Assertion({
    passed: !equalAssertion.passed,
    operator: 'notEqual',
    actual,
    expected
  });
}
