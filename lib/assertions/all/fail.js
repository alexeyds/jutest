import Assertion from 'assertions/assertion';
import { inspect } from 'util';

export default function fail(message) {
  return Assertion.create({
    passed: false,
    operator: 'fail',
    buildFailureMessage: () => `t.fail(${inspect(message)})`
  });
}