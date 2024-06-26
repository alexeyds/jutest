import { readLine } from "utils/file";
import { ErrorStackParser } from "utils/error-stack-parser";

export class ErrorSourceTracer {
  constructor(error, runtimeConfig) {
    this._config = runtimeConfig;
    this.error = error;
    this.stackParser = new ErrorStackParser(error);
  }

  get sourceFrame() {
    if (!this._sourceFrame) {
      this._sourceFrame = findSourceFrame(this.stackFrames, this._config); 
    }

    return this._sourceFrame;
  }

  get stackFrames() {
    return this.stackParser.stackFrames;
  }

  async readSourceLine() {
    if (!this.sourceFrame) {
      return;
    }
    let { lineNumber, file } = this.sourceFrame;
    let readLineResult = await readLine(file, lineNumber);

    if (readLineResult.success) {
      return readLineResult.line.trim();
    } else {
      return `(${readLineResult.error})`;
    }
  }
}

function findSourceFrame(stackFrames, runtimeConfig) {
  let { trackedSourcePaths, ignoredSourcePaths } = runtimeConfig;

  return stackFrames.find(frame => {
    let { file } = frame;

    return (
      file &&
      !frame.isInternal &&
      trackedSourcePaths.some(p => file.startsWith(p)) &&
      ignoredSourcePaths.every(p => !file.startsWith(p))
    );
  });
}
