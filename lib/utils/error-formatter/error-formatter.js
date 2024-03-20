import { parseStack } from "./parse-stack";

export class ErrorFormatter {
  constructor(error, { internalPaths=[] }={}) {
    this.error = error;
    this._internalPaths = internalPaths;
  }

  get message() {
    return this.error.message;
  }

  get stackFrames() {
    if (!this._stackFrames) {
      this._stackFrames = parseStack(this.error.stack, { internalPaths: this._internalPaths });
    }

    return this._stackFrames;
  }
}
