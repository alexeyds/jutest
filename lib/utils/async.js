export function createOrderedResolver(asyncFunctions) {
  return async (...args) => {
    for (let func of asyncFunctions) {
      await func(...args);
    }
  };
}
