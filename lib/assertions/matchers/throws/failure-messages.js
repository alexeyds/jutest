import { inspect } from 'util';

export function noErrorThrownMessage({ expected }) {
  return (
    `expected ${inspectMatcher(expected)}, but no errors were raised` +
    `\n` +
    `\n` +
    `(operator: throws)`
  );
}

export function wrongErrorThrownMessage({ expected, actual }) {
  return (
    `expected: ${inspectMatcher(expected)}, got: ${inspect(actual)}` +
    `\n` +
    `\n` +
    `(operator: throws)`
  );
}

function inspectMatcher(matcher) {
  if (typeof matcher === 'function') {
    return `\`${matcher.name}\``;
  } else {
    return inspect(matcher);
  }
}
