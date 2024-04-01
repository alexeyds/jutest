import { inspect } from "util";
import { ErrorSourceTracer } from "reporters/shared";

export function presentErrorMessage(error) {
  let name = error?.name;
  let message = error?.message;

  if (name === 'AssertionFailedError') {
    return message;
  } else if (name) {
    let result = name;

    if (message) {
      result += `: ${message}`;
    } else {
      result += ' (no error message)';
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

function presentStackFrames(sourceTracer) {
  let { stackFrames, sourceFrame } = sourceTracer;

  let newStackFrames = [];
  let newSourceFrame;

  stackFrames.forEach(frame => {
    if (frame.isInternal) return;

    let stackFrame = frame.stackFrame.replace(process.cwd(), ".");
    let newFrame = { ...frame, stackFrame };

    if (frame === sourceFrame) newSourceFrame = newFrame;
    newStackFrames.push(newFrame);
  });

  return { sourceFrame: newSourceFrame, stackFrames: newStackFrames };
}
