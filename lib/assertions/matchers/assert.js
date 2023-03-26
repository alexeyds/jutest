import { assertionFailedMessage } from "assertions/utils/failure-messages";

export function assert(actual) {
  let passed = !!actual;
  let result = { passed };

  if (!passed) {
    result.failureMessage = assertionFailedMessage({
      operator: 'assert',
      expected: true,
      actual,
    });
  }

  return result;
}

export function refute(actual) {
  let passed = !actual;
  let result = { passed };

  if (!passed) {
    result.failureMessage = assertionFailedMessage({
      operator: 'refute',
      expected: false,
      actual,
    });
  }

  return result;
}
