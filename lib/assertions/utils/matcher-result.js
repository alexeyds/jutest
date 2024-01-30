export function success() {
  return matcherResult({ passed: true });
}

export function failure(failureMessage) {
  return matcherResult({
    passed: false,
    failureMessage
  });
}

export function matcherResult({ passed, failureMessage }) {
  return { passed, failureMessage };
}
