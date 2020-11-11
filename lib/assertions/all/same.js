import Assertion from 'assertions/assertion';
import deepEqual from "deep-equal";

export default function same(actual, expected) {
  return new Assertion({
    passed: deepEqual(actual, expected, {strict: true}),
    operator: 'same',
    actual,
    expected
  });
}