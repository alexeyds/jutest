import { ErrorFormatter } from "utils/error-formatter";

export class SourceLocator {
  constructor({ sourceError=new Error(), sourceFilePath }={}) {
    this.sourceError = sourceError;
    this.sourceFilePath = sourceFilePath;
    this._errorFormatter = new ErrorFormatter(sourceError);
  }

  get lineNumber() {
    if (!this.sourceFilePath) {
      return undefined;
    }

    if (!this._lineNumber) {
      let frame = this._errorFormatter.stackFrames.find(f => f.file.includes(this.sourceFilePath));
      this._lineNumber = frame?.lineNumber;
    }

    return this._lineNumber;
  }
}
