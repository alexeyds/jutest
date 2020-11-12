import { inspect } from 'util';
import Assertion from 'assertions/assertion';

export default function throws(expression, matcher) {
  try {
    expression();

    return new Assertion({
      passed: false,
      operator: 'throws',
      actual: undefined,
      getFailureDetails: () => noErrorRaisedMessage({matcher}),
      expected: matcher
    });
  } catch(e) {
    return new Assertion({
      passed: doesErrorMatch(e, matcher),
      operator: 'throws',
      getFailureDetails: () => wrongErrorRaisedMessage({matcher, error: e}),
      actual: e,
      expected: matcher
    });
  }
}

function doesErrorMatch(error, matcher) {
  if (typeof matcher === 'string') {
    return matchAgainstString(error, matcher);
  } else if (matcher instanceof RegExp) {
    return matcher.test(error);
  } else if (typeof matcher === 'function') {
    return error instanceof matcher;
  } else {
    return Object.is(error, matcher);
  }
}

function matchAgainstString(error, string) {
  if (typeof error === 'string') {
    return error.includes(string);
  } else if (error instanceof Error) {
    let { message, name } = error;
    return message.includes(string) ||name === string;
  } else {
    return false;
  }
}

function noErrorRaisedMessage({matcher}) {
  return (
    `Expected ${inspectMatcher(matcher)}, but no errors were raised` +
    `\n` +
    `\n` +
    `(operator: throws)`
  );
}

function wrongErrorRaisedMessage({error, matcher}) {
  return (
    `Expected ${inspectMatcher(matcher)}, got: ${inspectError(error)}` +
    `\n` +
    `\n` +
    `(operator: throws)`
  );
}

function inspectMatcher(matcher) {
  if (typeof matcher === 'function') {
    return `\`${matcher.name}\``;
  } else {
    return inspect(matcher);
  }
}

function inspectError(error) {
  return inspect(error);
}