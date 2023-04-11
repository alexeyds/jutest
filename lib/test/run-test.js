import { createAssertions } from "assertions";

export async function runTest(testBody, context) {
  let result;
  let assertions = createAssertions();
  let assigns;

  try {
    assigns = await context.runSetups();
    await context.runBeforeTestAssertions(assertions, assigns);
    await testBody(assertions, assigns);
    await context.runAfterTestAssertions(assertions, assigns);

    result = passed();
  } catch(error) {
    result = failed(error);
  }

  try {
    await context.runTeardowns(assigns);
  } catch(error) {
    result.passed = false;
    result.teardownError = error;
  }

  return result;
}

function passed() {
  return testResult({ passed: true });
}

function failed(error) {
  return testResult({ passed: false, error });
}

function testResult({ passed, error=null }) {
  return {
    passed,
    error,
    teardownError: null
  };
}
