import { isPlainObject } from "is-plain-object";

export { isPlainObject };

export { default as pick } from "lodash.pick";

export function deepMerge(target, source) {
  let result = { ...target };

  for (let key in source) {
    let targetValue = target[key];
    let sourceValue = source[key];
    let resultValue;

    if (isPlainObject(targetValue) && isPlainObject(sourceValue)) {
      resultValue = deepMerge(targetValue, sourceValue);
    } else {
      resultValue = sourceValue;
    }

    result[key] = resultValue;
  }

  return result;
}
