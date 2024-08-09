import { JutestAssertions } from "assertions";
import { ExecutionResult } from "./execution-result";
import { originalTimers } from "utils/original-timers";

export async function runTest(testBody, context) {
  let { timeoutPromise, timeoutId } = timeoutTest(context);

  let result = await Promise.race([
    doRunTest(testBody, context),
    timeoutPromise,
  ]);

  originalTimers.clearTimeout(timeoutId);

  return result;
}

async function doRunTest(testBody, context) {
  let result;
  let assertions = new JutestAssertions();
  let { tags } = context;
  let assigns = {};

  try {
    assigns = await context.runSetups();
    await context.runBeforeTestAssertions(assertions, assigns);
    await testBody(assertions, assigns);
    await context.runAfterTestAssertions(assertions, assigns);
  } catch(error) {
    result = ExecutionResult.failed(error);
  }

  try {
    await context.runTeardowns(assigns, tags);
  } catch(error) {
    result = result || ExecutionResult.failed(error);
  }

  result = result || ExecutionResult.passed();

  return result.toObject();
}

function timeoutTest(context) {
  let timeoutId;
  let { timeout } = context.tags;

  let timeoutPromise = new Promise(resolve => {
    timeoutId = originalTimers.setTimeout(() => {
      resolve(ExecutionResult.failed(new Error(`Test timed out after ${timeout}ms`)));
    }, timeout);
  });

  return { timeoutPromise, timeoutId };
}
