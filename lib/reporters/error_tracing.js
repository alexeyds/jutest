import nodePath from "path";

export function splitStackTrace(error) {
  return error.stack
    .replace(error.message, "")
    .split('\n')
    .slice(1)
    .map(l => l.replace(/^\s+/, ''));
}

export function traceFailedLine(error, { sourceDir, excludeSourceDirs=[] }) {
  let stack = splitStackTrace(error);
  let excludedPaths = excludeSourceDirs.map(d => nodePath.join(sourceDir, d, '/'));

  return stack.find(l => !excludedPaths.some(p => l.includes(p)) && l.includes(sourceDir)) || null;
}
