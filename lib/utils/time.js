export async function measureTimeElapsed(func) {
  let start = performance.now();
  await func();
  let end = performance.now();
  return end - start;
}
