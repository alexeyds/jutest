import { isEqual } from "./is-equal";

export function isApproxEqual(actual, expected, { tolerance=0.00001 }={}) {
  if (isNumber(actual) && isNumber(expected)) {
    let diff = Math.abs(expected - actual);
    return diff < tolerance;
  } else {
    return isEqual(actual, expected);
  }
}

function isNumber(value) {
  return Number.isFinite(value);
}
