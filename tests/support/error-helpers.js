export function attachStackFrame(error, stackFrames) {
  error.stack = `${error.name}: ${error.message}\n` + stackFrames.join("\n");
  return error;
}
