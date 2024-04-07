export async function measureTimeElapsed(func) {
  let start = performance.now();
  let returnValue = await func();
  let end = performance.now();

  return { 
    time: end - start,
    returnValue,
  };
}

export function presentMilliseconds(ms) {
  let seconds = ms / 1000;

  return `${seconds.toFixed(2)}s`;
}
