export async function measureTimeElapsed(func) {
  let start = performance.now();
  let returnValue = await func();
  let end = performance.now();

  return { 
    time: end - start,
    returnValue,
  };
}
