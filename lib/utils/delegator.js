export function createDelegator(source, functions) {
  let delegator = {};

  for (let name in functions) {
    let value = functions[name];
    let newName = name;

    if (!value) continue;

    if (typeof value === 'string') {
      newName = value;
    }

    delegator[newName] = createDelegatorFunction(source[name].bind(source));
  }

  return delegator;
}

export function createDelegatorFunction(sourceFunction) {
  return (...args) => sourceFunction(...args);
}
