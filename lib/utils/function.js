export function nameFunction(func, name) {
  Object.defineProperty(func, 'name', { value: name });
  return func;
}
