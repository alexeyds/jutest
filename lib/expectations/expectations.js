import { errorMatches } from 'expectations/matchers';

export default {
  assert(actual) {
    let expected = true;
    return matchExpectation(expected === actual, {
      actual,
      expected,
      operator: 'assert'
    });
  },

  equal(actual, expected) {
    return matchExpectation(Object.is(actual, expected), {
      actual,
      expected,
      operator: 'equal'
    });
  },

  throws(expression, expected) {
    let errorThrown = false;
    let error;

    try {
      expression();
    } catch(e) {
      errorThrown = true;
      error = e;
    }
    
    let passed;
    let actual;
    if (errorThrown) {
      actual = error;
      passed = errorMatches(error, expected);
    } else {
      actual = 'No error';
      passed = false;
    }

    return matchExpectation(passed, {
      actual: actual,
      expected: expected,
      operator: 'throws'
    });
  }
};

function matchExpectation(result, expectationAttributes) {
  if (result) {
    return true;
  } else {
    throw new ExpectationError(expectationAttributes);
  }
}

class ExpectationError extends Error {
  constructor({ actual, expected, operator }) {
    super("Failed expectation");

    this.actual = actual;
    this.expected = expected;
    this.operator = operator;
  }
}
