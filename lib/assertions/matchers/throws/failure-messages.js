import { inspect } from 'util';

export function noErrorThrownMessage({ expected }) {
  return (
    `Expected ${inspectMatcher(expected)}, but no errors were raised` +
    `\n` +
    `\n` +
    `(operator: throws)`
  );
}

export function wrongErrorThrownMessage({ expected, actual }) {
  return (
    `expected: ${inspectMatcher(expected)}\n`+
    `     got: ${inspect(actual)}` +
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
