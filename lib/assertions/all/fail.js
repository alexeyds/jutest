import Assertion from 'assertions/assertion';
import { inspect } from 'util';

export default function fail(message) {
  return new Assertion({
    passed: false,
    operator: 'fail',
    getFailureDetails: () => `t.fail(${inspect(message)})`
  });
}