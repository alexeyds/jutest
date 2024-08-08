import { originalTimers } from "utils/original-timers";

export async function measureTimeElapsed(func) {
  let start = originalTimers.performance.now();
  let returnValue = await func();
  let end = originalTimers.performance.now();

  return { 
    time: end - start,
    returnValue,
  };
}

export function presentMilliseconds(ms) {
  let seconds = ms / 1000;

  return `${seconds.toFixed(2)}s`;
}
