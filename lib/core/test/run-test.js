import { JutestAssertions } from "assertions";
import { ExecutionResult } from "./execution-result";

export async function runTest(testBody, context) {
  let result;
  let assertions = new JutestAssertions();
  let assigns;

  try {
    assigns = await context.runSetups();
    await context.runBeforeTestAssertions(assertions, assigns);
    await testBody(assertions, assigns);
    await context.runAfterTestAssertions(assertions, assigns);

    result = ExecutionResult.passed();
  } catch(error) {
    result = ExecutionResult.failed(error);
  }

  try {
    await context.runTeardowns(assigns);
  } catch(error) {
    result.addTeardownError(error);
  }

  return result.toObject();
}
