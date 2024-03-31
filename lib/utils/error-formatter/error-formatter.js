import { parseStack } from "./parse-stack";

export class ErrorFormatter {
  constructor(error, { internalPaths=[] }={}) {
    this.error = error;
    this._internalPaths = internalPaths;
  }

  get message() {
    return this.error.message;
  }

  get stack() {
    if (!this._stack) {    
      let errorNameRegex = /^[0-9a-zA-Z_$]+(:\s+)?\n/;
      this._stack = this.error.stack.replace(this.message, '').replace(errorNameRegex, '');
    }

    return this._stack;
  }

  get stackFrames() {
    if (!this._stackFrames) {
      this._stackFrames = parseStack(this.stack, { internalPaths: this._internalPaths });
    }

    return this._stackFrames;
  }
}
