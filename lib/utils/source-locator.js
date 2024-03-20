import { ErrorFormatter } from "utils/error-formatter";

export class SourceLocator {
  constructor({ sourceError=new Error(), sourceFilePath }={}) {
    this.sourceError = sourceError;
    this.sourceFilePath = sourceFilePath;
    this._errorFormatter = new ErrorFormatter(sourceError);
  }

  get lineNumber() {
    return this.lineNumbers[0];
  }

  get lineNumbers() {
    if (!this._lineNumbers) {
      if (this.sourceFilePath) {
        this._lineNumbers = this._findMatchingFrames().map(f => f.lineNumber)
      } else {
        this._lineNumbers = [];
      }
    }

    return this._lineNumbers;
  }

  _findMatchingFrames() {
    return this._errorFormatter
      .stackFrames 
      .filter(({ file }) => file && file.includes(this.sourceFilePath))
  }
}
