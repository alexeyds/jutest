import { reduceAsync } from "utils/async";
import { deepMerge, isPlainObject } from "utils/object";

export function createTestContext() {
  return {
    names: [],
    setups: [],
    teardowns: [],
    beforeTestAssertions: [],
    afterTestAssertions: []
  };
}

export function addToContext(context, name, item) {
  return {
    ...context,
    [name]: [...context[name], item]
  };
}

export function runSetups(context) {
  return reduceAsync(context.setups, {}, async (assigns, setup) => {
    let newAssigns = await setup(assigns);
    return deepMerge(assigns, ensureObject(newAssigns));
  });
}

function ensureObject(item) {
  return isPlainObject(item) ? item : {};
}
