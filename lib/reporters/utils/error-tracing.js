import nodePath from "path";
import { readLine } from "utils/file";
import { ErrorFormatter } from "utils/error-formatter";

export function traceFailedLine(error, config) {
  return findStackFrame(error, config)?.stackFrame;
}

export async function readFailedLine(error, config) {
  let frame = findStackFrame(error, config);
  if (!frame) return null;

  let { file, lineNumber } = frame;

  if (file && lineNumber) {
    let result = await readLine(file, lineNumber);

    return result.line && result.line.trim();
  }
}

function findStackFrame(error, { sourceDir, excludeSourceDirs=[] }) {
  let excludedPaths = excludeSourceDirs.map(d => nodePath.join(sourceDir, d, '/'));
  let stack = new ErrorFormatter(error, { internalPaths: excludedPaths }).stackFrames;

  return stack.find((stack) => {
    return !stack.isInternal && stack.file && stack.file.includes(sourceDir);
  });
}