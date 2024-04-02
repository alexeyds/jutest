import { inspect } from "util";
import { ErrorSourceTracer } from "reporters/shared";

export function presentErrorMessage(error) {
  let name = error?.name;
  let message = error?.message;

  if (isAssertionError(error)) {
    return message;
  } else if (name) {
    let result = name;

    if (message) {
      result += `: ${message}`;
    } else {
      result += ' (no message)';
    }

    return result;
  } else {
    return `Runtime error: ${inspect(error)}`;
  }
}

export async function presentSourceDetails(error, reporterConfig) {
  if (error?.stack) {  
    let sourceTracer = new ErrorSourceTracer(error, reporterConfig);
    let { stackFrames, sourceFrame } = presentStackFrames(sourceTracer);
    let sourceLine = await sourceTracer.readSourceLine();

    return {
      sourceFrame,
      stackFrames,
      sourceLine,
    };
  } else {
    return {
      sourceFrame: null,
      stackFrames: [],
      sourceLine: "(no stack trace)",
    };
  }
}

export function presentTestLocation({ lineNumber, file }) {
  let result = '';
  if (file) {
    result += replaceCwd(file);

    if (lineNumber) {
      result += `:${lineNumber}`;
    }
  }

  return result;
}

function presentStackFrames(sourceTracer) {
  let { stackFrames, sourceFrame, error } = sourceTracer;

  let newStackFrames = [];
  let newSourceFrame;

  stackFrames.forEach(frame => {
    if (frame.isInternal) return;
    if (isAssertionError(error)) {
      if (sourceFrame && frame !== sourceFrame) return;
    }

    let stackFrame = replaceCwd(frame.stackFrame);
    let newFrame = { ...frame, stackFrame };

    if (frame === sourceFrame) newSourceFrame = newFrame;
    newStackFrames.push(newFrame);
  });

  return { sourceFrame: newSourceFrame, stackFrames: newStackFrames };
}

function isAssertionError(error) {
  return error?.name === 'AssertionFailedError';
}

function replaceCwd(path) {
  return path.replace(process.cwd(), ".");
}
