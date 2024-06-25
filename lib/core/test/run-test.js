import { JutestAssertions } from "assertions";
import { ExecutionResult } from "./execution-result";

export function runTest(testBody, context) {
  let { promise, timeoutId } = timeoutTest(context);

  return Promise.race([
    doRunTest(testBody, context),
    promise,
  ]).then(r => {
    clearTimeout(timeoutId);
    return r;
  });
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

  let promise = new Promise(resolve => {
    timeoutId = setTimeout(() => {
      resolve(ExecutionResult.failed(new Error(`Test timed out after ${timeout}ms`)));
    }, timeout);
  });

  return { promise, timeoutId };
}
