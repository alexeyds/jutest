import { JutestAssertions } from "assertions";
import { ExecutionResult } from "./execution-result";

export async function runTest(testBody, context) {
  let result;
  let assertions = new JutestAssertions();
  let { tags } = context;

  try {
    let assigns = await context.runSetups();
    await context.runBeforeTestAssertions(assertions, assigns);
    await testBody(assertions, assigns);
    await context.runAfterTestAssertions(assertions, assigns);
    await context.runTeardowns(assigns, tags);

    result = ExecutionResult.passed();
  } catch(error) {
    result = ExecutionResult.failed(error);
  }

  return result.toObject();
}
