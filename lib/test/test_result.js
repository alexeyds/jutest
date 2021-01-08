function passed({ testName }) {
  return {
    passed: true,
    error: null,
    testName
  };
}

function errored({ testName, error }) {
  return {
    passed: false,
    testName,
    error
  };
}

export default { passed, errored };