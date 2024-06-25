import { JutestAssertions } from "assertions";
import { ExecutionResult } from "./execution-result";

export async function runTest(testBody, context) {
  let { timeoutPromise, timeoutId } = timeoutTest(context);

  let result = await Promise.race([
    doRunTest(testBody, context),
    timeoutPromise,
  ]);

  clearTimeout(timeoutId);

  return result;
}

async function doRunTest(testBody, context) {
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

function timeoutTest(context) {
  let timeoutId;
  let { timeout } = context.tags;

  let timeoutPromise = new Promise(resolve => {
    timeoutId = setTimeout(() => {
      resolve(ExecutionResult.failed(new Error(`Test timed out after ${timeout}ms`)));
    }, timeout);
  });

  return { timeoutPromise, timeoutId };
}
