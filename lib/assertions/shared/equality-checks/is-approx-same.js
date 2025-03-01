import { isApproxEqual } from "./is-approx-equal";

export function isApproxSame(expected, actual, opts) {
  if (isArray(expected) && isArray(actual)) {
    return isApproxSameArray(expected, actual, opts);
  } else if (isObject(expected) && isObject(actual)) {
    return isApproxSameObject(expected, actual, opts);
  } else {
    return isApproxEqual(expected, actual, opts);
  }
}

function isApproxSameArray(expected, actual, opts) {
  if (expected.length !== actual.length) {
    return false;
  }

  for (let i = 0; i < expected.length; i++) {
    let isSame = isApproxSame(expected[i], actual[i], opts);

    if (!isSame) {
      return false;
    }
  }

  return true;
}

function isApproxSameObject(expected, actual, opts) {
  let expectedKeys = Object.keys(expected);
  let actualKeys = Object.keys(actual);

  if (expectedKeys.length !== actualKeys.length) {
    return false;
  }

  if (!expectedKeys.every(key => actualKeys.includes(key))) {
    return false;
  }

  for (let key in expected) {
    let isSame = isApproxSame(expected[key], actual[key], opts);

    if (!isSame) {
      return false;
    }
  }

  return true;
}

function isArray(value) {
  return Array.isArray(value) || value instanceof Float32Array || value instanceof Float64Array;
}

function isObject(value) {
  return value && typeof value === 'object';
}
