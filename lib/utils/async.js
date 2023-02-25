export function createOrderedResolver(asyncFunctions) {
  return async (...args) => {
    for (let func of asyncFunctions) {
      await func(...args);
    }
  };
}

export async function reduceAsync(array, initialValue, reducer) {
  let acc = initialValue;

  for (let item of array) {
    acc = await reducer(acc, item);
  }

  return acc;
}
