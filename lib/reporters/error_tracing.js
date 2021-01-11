export function splitStackTrace(error) {
  return error.stack
    .replace(error.message, "")
    .split('\n')
    .slice(1)
    .map(l => l.replace(/^\s+/, ''));
}