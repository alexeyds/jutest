export function errorMatches(error, expected) {
  let message = extractErrorMessage(error);
  let name = extractErrorName(error);

  if (typeof expected === 'string') {
    return name === expected || (typeof message === 'string' && message.includes(expected));
  } else if (expected instanceof RegExp) {
    return typeof message === 'string' && !!message.match(expected);
  } else if (typeof expected === 'function') {
    return error instanceof expected;
  } else {
    return error === expected;
  }
}

function extractErrorMessage(error) {
  if (error && error.message) {
    return error.message;
  } else {
    return error;
  }
}

function extractErrorName(error) {
  if (error && error.name) {
    return error.name;
  } else {
    return null;
  }
}