import { ErrorStackParser } from "utils/error-stack-parser";

export function addPadding(text, numberOfSpaces) {
  return text
    .split('\n')
    .map(line => isBlank(line) ? line : pad(line, numberOfSpaces))
    .join('\n');
}

function isBlank(line) {
  return line.length === 0 || /^\s+$/.test(line);
}

function pad(line, numberOfSpaces) {
  return " ".repeat(numberOfSpaces) + line;
}

export function joinLines(...lines) {
  return lines.join('\n');
}

export function presentStackTrace(error) {
  if (error instanceof Error) {
    let stackParser = new ErrorStackParser(error);
    return stackParser.stackFrames.map(f => f.stackFrame).join('\n');
  } else {
    return '(no stack trace)';
  }
}
