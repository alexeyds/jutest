import deepEqual from "deep-equal";

export function isSame(actual, expected) {
  return deepEqual(actual, expected, { strict: true });
}
