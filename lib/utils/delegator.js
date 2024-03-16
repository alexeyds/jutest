import { inspect } from "util";

export function createDelegator(source, functions, { hideReturnValues=false }={}) {
  let delegator = {};

  for (let name in functions) {
    let value = functions[name];
    let newName = name;

    if (!value) continue;

    if (typeof value === 'string') {
      newName = value;
    }

    if (typeof source[name] !== 'function') {
      throw new Error(`Unable to create delegator for ${inspect(source)}, targeted function "${name}" is missing.`);
    }

    delegator[newName] = createDelegatorFunction(source[name].bind(source), { hideReturnValue: hideReturnValues });
  }

  return delegator;
}

export function createDelegatorFunction(sourceFunction, { hideReturnValue=false }={}) {
  return (...args) => {
    let returnValue = sourceFunction(...args);

    if (!hideReturnValue) {
      return returnValue;
    }
  }
}
