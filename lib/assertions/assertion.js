import { inspect } from 'util';

export class AssertionFailedError extends Error {
  constructor() {
    super(...arguments);
    this.name = 'AssertionFailedError';
  }
}

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
      failureMessage
    };
  }

  static negate(assertion, { operator, buildFailureMessage=negationFailedMessage }) {
    return Assertion.create({ ...assertion, operator, passed: !assertion.passed, buildFailureMessage });
  }

  static ensurePassed(assertion) {
    if (assertion.passed) {
      return true;
    } else {
      throw new AssertionFailedError(assertion.failureMessage);
    }
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
    `     got: ${inspect(actual)}` +
    '\n' +
    '\n' +
    `(operator: ${operator})`
  );
}

export class AssertionResult {
  constructor({ passed, operator, expected, actual, negated=false }) {
    this.passed = passed;
    this.operator = operator;
    this.expected = expected;
    this.actual = actual;
    this.negated = negated;
  }

  negate({ operator }) {
    let { actual, expected } = this;

    return new AssertionResult({
      passed: !this.passed,
      operator,
      actual,
      expected,
      negated: true
    });
  }
}

export function negateAssertion(assertion, { operator }) {
  let negatedAssertion = (...args) => {
    return assertion(...args).negate({ operator });
  };

  Object.defineProperty(negatedAssertion, 'name', { value: operator });

  return negatedAssertion;
}
