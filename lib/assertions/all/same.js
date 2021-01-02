import Assertion from 'assertions/assertion';
import deepEqual from "deep-equal";

export function same(actual, expected) {
  return Assertion.create({
    passed: deepEqual(actual, expected, {strict: true}),
    operator: 'same',
    actual,
    expected
  });
}

export function notSame() {
  return Assertion.negate(same(...arguments), { operator: 'notSame' });
}