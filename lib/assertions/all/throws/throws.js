import { inspect } from 'util';
import { tryFunctionCall } from "utils/error";
import doesErrorMatch from "./does-error-match";
import Assertion from 'assertions/assertion';

export default function throws(expression, matcher) {
  let { success, error } = tryFunctionCall(expression);

  if (success) {
    return Assertion.create({
      passed: false,
      operator: 'throws',
      actual: undefined,
      buildFailureMessage: noErrorRaisedMessage,
      expected: matcher
    });
  } else {
    return Assertion.create({
      passed: doesErrorMatch(error, matcher),
      operator: 'throws',
      buildFailureMessage: wrongErrorRaisedMessage,
      actual: error,
      expected: matcher
    });
  }
}

function noErrorRaisedMessage({expected, operator}) {
  return (
    `Expected ${inspectMatcher(expected)}, but no errors were raised` +
    `\n` +
    `\n` +
    `(operator: ${operator})`
  );
}

function wrongErrorRaisedMessage({expected, actual, operator}) {
  return (
    `Expected ${inspectMatcher(expected)}, got: ${inspect(actual)}` +
    `\n` +
    `\n` +
    `(operator: ${operator})`
  );
}

function inspectMatcher(matcher) {
  if (typeof matcher === 'function') {
    return `\`${matcher.name}\``;
  } else {
    return inspect(matcher);
  }
}
