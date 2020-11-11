import { inspect } from 'util';

export default class Assertion {
  constructor({actual, expected, passed, operator, getFailureDetails}) {
    this.actual = actual;
    this.expected = expected;
    this.passed = passed;
    this.operator = operator;
    this._getFailureDetails = getFailureDetails;
  }

  get failureDetails() {
    if (this._getFailureDetails) {
      return this._getFailureDetails();
    } else {
      return this._fallbackFailureDetails();
    }
  }

  _fallbackFailureDetails() {  
    return (
      '\n' +
      `expected: ${inspect(this.expected)}\n` +
      `     got: ${inspect(this.actual)}\n` +
      '\n' +
      `(operator: ${this.operator})`
    );
  }
}
