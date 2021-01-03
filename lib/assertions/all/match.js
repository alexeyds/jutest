import { inspect } from 'util';
import Assertion from 'assertions/assertion';

export function match(actual, expected) {
  if (!(expected instanceof RegExp)) {
    throw new Error(
      `t.match(${inspect(actual)}, ${inspect(expected)}) assertion is not supported, ` + 
      "second argument must be a regular expression."
    );
  }
  return Assertion.create({
    passed: expected.test(actual),
    operator: 'match',
    actual,
    expected
  });
}

export function doesNotMatch() {
  return Assertion.negate(match(...arguments), { operator: 'doesNotMatch' });
}