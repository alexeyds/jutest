import { formatStackFrames } from "utils/error-formatting";

export class SourceLocator {
  constructor({ sourceError=new Error(), sourceFilePath }={}) {
    this.sourceError = sourceError;
    this.sourceFilePath = sourceFilePath;
  }

  get lineNumber() {
    if (this._lineNumber) {
      return this._lineNumber;
    }

    if (!this.sourceFilePath) {
      return;
    }

    this._lineNumber = detectLineNumber(this.sourceError, this.sourceFilePath)
    return this._lineNumber;
  }
}

function detectLineNumber(error, filePath) {
  let lineFrame = formatStackFrames(error).find(f => f.includes(filePath))

  if (lineFrame) {
    let match = lineFrame.replace(filePath, '').match(/:(\d+)/);
    return parseInt(match[1]);
  }
}
