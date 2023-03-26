import { inspect } from 'util';

export function assertionFailedMessage({expected, actual, operator}) {
  return (
    `expected: ${inspect(expected)}\n` +
    `     got: ${inspect(actual)}` +
    '\n' +
    '\n' +
    `(operator: ${operator})`
  );
}

export function negationFailedMessage({expected, actual, operator}) {
  return (
    `expected: not ${inspect(expected)}\n` +
    `     got: ${inspect(actual)}` +
    '\n' +
    '\n' +
    `(operator: ${operator})`
  );
}
