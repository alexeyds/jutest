export function assert(actual) {
  let expected = true;

  return assertExpression(expected === actual, {
    actual,
    expected,
    operator: 'assert'
  });
}

function assertExpression(result, { actual, expected, operator }) {
  if (result) {
    return true;
  } else {
    throw new AssertionError(`Failed assertion`, { actual, expected, operator });
  }
}

class AssertionError extends Error {
  constructor(name, { actual, expected, operator }) {
    super(name);

    this.actual = actual;
    this.expected = expected;
    this.operator = operator;
  }
}
