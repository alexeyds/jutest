import nodePath from "path";
import { readLine } from "utils/file";

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

export async function readFailedLine(error, config) {
  let line = traceFailedLine(error, config);
  if (!line) return null;

  let match = line.match(/(\/.+?):(\d+)(|:\d+)/);
  if (!match) return null;

  let [, file, lineNumber] = match; 
  let result = await readLine(file, lineNumber);

  return result.line && result.line.trim();
}