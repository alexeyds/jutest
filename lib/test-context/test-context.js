import { resolveAsyncFunctionsInOrder } from "utils/promise";
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
  let setups = context.setups.map(wrapSetupInAssignsChain);
  return resolveAsyncFunctionsInOrder(setups);
}

function wrapSetupInAssignsChain(setup) {
  return async function(previousAssigns) {
    previousAssigns = ensureObject(previousAssigns);
    let nextAssigns = ensureObject(await setup(previousAssigns));

    return deepMerge(previousAssigns, nextAssigns);
  };
}

function ensureObject(item) {
  return isPlainObject(item) ? item : {};
}
