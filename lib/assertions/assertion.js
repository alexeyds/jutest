import { inspect } from 'util';

export default class Assertion {
  static create({actual, expected, passed, operator, buildFailureMessage=assertionFailedMessage}) {
    let failureMessage = null;

    if (!passed) {
      failureMessage = buildFailureMessage({ expected, actual, operator });
    }

    return {
      actual,
      expected,
      passed,
      operator,
      failureMessage,
      failureDetails: failureMessage
    };
  }

  static negate(assertion, { operator, buildFailureMessage=negationFailedMessage }) {
    return Assertion.create({ ...assertion, operator, passed: !assertion.passed, buildFailureMessage });
  }
}

function assertionFailedMessage({expected, actual, operator}) {
  return (
    `expected: ${inspect(expected)}\n` +
    `     got: ${inspect(actual)}` +
    '\n' +
    '\n' +
    `(operator: ${operator})`
  );
}

function negationFailedMessage({expected, actual, operator}) {
  return (
    `expected: not ${inspect(expected)}\n` +
    `     got:     ${inspect(actual)}` +
    '\n' +
    '\n' +
    `(operator: ${operator})`
  );
}
