export function resolveAsyncFunctionsInOrder(functions) {
  let promise = Promise.resolve();

  functions.forEach(f => {
    promise = promise.then(f);
  });

  return promise;
}