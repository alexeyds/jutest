export function fail(message) {
  return {
    passed: false,
    failureMessage: message
  };
}
