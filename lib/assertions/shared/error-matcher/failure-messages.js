import { inspect } from 'util';

export function noErrorThrownMessage({ expected, operator, isAPromise }) {
  let noErrorDescription = isAPromise ? 'promise resolved without errors' : 'no errors were raised';

  return (
    `expected ${inspectMatcher(expected)}, but ${noErrorDescription}` +
    `\n` +
    `\n` +
    `(operator: ${operator})`
  );
}

export function wrongErrorThrownMessage({ expected, actual, operator }) {
  return (
    `expected: ${inspectMatcher(expected)}, got: ${inspect(actual)}` +
    `\n` +
    `\n` +
    `(operator: ${operator})`
  );
}

function inspectMatcher(matcher) {
  if (typeof matcher === 'function') {
    return `\`${matcher.name}\``;
  } else {
    return inspect(matcher);
  }
}
