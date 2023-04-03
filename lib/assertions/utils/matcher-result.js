export function success() {
  return {
    passed: true
  };
}

export function failure(failureMessage) {
  return {
    passed: false,
    failureMessage
  };
}
