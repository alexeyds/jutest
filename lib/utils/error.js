export function tryFunctionCall(func) {
  let success;
  let returnValue;
  let error = null;

  try {
    returnValue = func();
    success = true;
  } catch(e) {
    success = false;
    error = e;
  }

  return {
    success,
    returnValue,
    error
  };
}