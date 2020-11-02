export default function createTest(name, runner) {
  let testResult = new TestResult();
  let assertions = wrapInTestResult(testResult, {assert});

  return {
    name,
    run: () => {
      runner(assertions);
      return testResult;
    }
  };
}

class TestResult {
  constructor() {
    this.passed = true;
    this.assertions = [];
    this.failedAssertions = [];
  }

  addAssertionResult(assertion) {
    this.assertions.push(assertion);

    if (!assertion.passed) {
      this.passed = false;
      this.failedAssertions.push(assertion);
    }
  }
}

function wrapInTestResult(testResult, assertions) {
  let result = {};

  for (let name in assertions) {
    let doAssertion = assertions[name];

    result[name] = function() {
      testResult.addAssertionResult(doAssertion(...arguments));
    };
  }

  return result;
}

function assert(target) {
  return {
    operator: 'assert',
    actual: target,
    expected: true,
    passed: target === true
  };
}
