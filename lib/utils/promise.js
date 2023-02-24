export function resolveAsyncFunctionsInOrder(functions) {
  let promise = Promise.resolve();

  functions.forEach(f => {
    promise = promise.then(f);
  });

  return promise;
}

export function isPromise(object) {
  return !!object && typeof object.then === 'function';
}
