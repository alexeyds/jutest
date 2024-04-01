import { ErrorStackParser } from "utils/error-stack-parser";

export class TestSourceLocator {
  constructor({ sourceError=new Error(), sourceFilePath }={}) {
    this.sourceError = sourceError;
    this.sourceFilePath = sourceFilePath;
    this._stackParser = new ErrorStackParser(sourceError);
  }

  get lineNumber() {
    return this.lineNumbers[0];
  }

  get lineNumbers() {
    if (!this._lineNumbers) {
      if (this.sourceFilePath) {
        this._lineNumbers = this._findMatchingFrames().map(f => f.lineNumber);
      } else {
        this._lineNumbers = [];
      }
    }

    return this._lineNumbers;
  }

  _findMatchingFrames() {
    return this._stackParser
      .stackFrames 
      .filter(({ file }) => file && file.includes(this.sourceFilePath));
  }
}
