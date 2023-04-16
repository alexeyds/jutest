import { assertionFailedMessage } from "core/assertions/utils/failure-messages";
import { success, failure } from 'core/assertions/utils/matcher-result';

export function assert(actual) {
  let passed = !!actual;

  if (passed) {
    return success();
  } else {
    return failure(assertionFailedMessage({      
      operator: 'assert',
      expected: true,
      actual,
    }));
  }
}

export function refute(actual) {
  let passed = !actual;

  if (passed) {
    return success();
  } else {
    return failure(assertionFailedMessage({
      operator: 'refute',
      expected: false,
      actual,
    }));
  }
}
