import Assertion from 'assertions/assertion';
import match from 'assertions/all/match';

export default function doesNotMatch(actual, expected) {
  let matchAssertion = match(actual, expected);

  return new Assertion({
    passed: !matchAssertion.passed,
    operator: 'doesNotMatch',
    actual,
    expected
  });
}