import Assertion from 'assertions/assertion';
import deepEqual from "deep-equal";

export default function notSame(actual, expected) {
  return new Assertion({
    passed: !deepEqual(actual, expected, {strict: true}),
    operator: 'notSame',
    actual,
    expected
  });
}