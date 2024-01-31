export function doesErrorMatch(error, matcher) {
  if (typeof matcher === 'string') {
    return matchAgainstString(error, matcher);
  } else if (matcher instanceof RegExp) {
    return matcher.test(error);
  } else if (typeof matcher === 'function') {
    return error instanceof matcher;
  } else {
    return Object.is(error, matcher);
  }
}

function matchAgainstString(error, string) {
  if (typeof error === 'string') {
    return error.includes(string);
  } else if (error instanceof Error) {
    return error.message.includes(string) || error.name === string;
  } else {
    return false;
  }
}
