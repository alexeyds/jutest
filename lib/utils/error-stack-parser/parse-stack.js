import { fileWithLineNumberRegexp } from "utils/file-location";

export function parseStack(stack) {
  let stackFrames = stack.split('\n');

  return stackFrames
    .map(f => f.trim())
    .filter(f => f)
    .map(f => parseFrame(f));
}

function parseFrame(stackFrame) {
  let { file, lineNumber } = extractFileInfo(stackFrame);
  let isInternal = false;

  if (file) {
    isInternal = file.startsWith('node:');
  }

  return { stackFrame, file, lineNumber, isInternal };
}

function extractFileInfo(stackFrame) {
  return extractFileFromV8StackFrame(stackFrame);
}

function extractFileFromV8StackFrame(stackFrame) {
  if (stackFrame.startsWith('at')) {  
    return extractFileInfoFromV8StackFrame(stackFrame);
  } else {
    return {};
  }
}

function extractFileInfoFromV8StackFrame(stackFrame) {
  return parseStackFrameMatch(
    matchSimpleV8StackFrame(stackFrame) ||
    matchComplexV8StackFrame(stackFrame)
  );
}

function parseStackFrameMatch(match) {
  if (match) {
    let [, file, lineNumbers] = match;
    let lineNumber = parseInt(lineNumbers.split(':')[1]);

    return { file, lineNumber };
  } else {
    return {};
  }
}

function matchSimpleV8StackFrame(stackFrame) {
  let regexp = new RegExp('^at ' + fileWithLineNumberRegexp.source + '$');
  return stackFrame.match(regexp);
}

function matchComplexV8StackFrame(stackFrame) {
  let regexp = new RegExp('\\s\\(' + fileWithLineNumberRegexp.source + '\\)');
  let match = stackFrame.match(regexp);

  if (match) {
    let nestedMatch = match[0].trim().match(regexp);
    if (nestedMatch) {
      match = nestedMatch;
    }
  }

  return match;
}
