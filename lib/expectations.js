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
    return matchExpectation(expected === actual, {
      actual,
      expected,
      operator: 'equal'
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
