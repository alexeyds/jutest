import { parseStack } from "./parse-stack";

export class ErrorStackParser {
  constructor(error) {
    this.error = error;
  }

  get message() {
    return this.error.message;
  }

  get stackWithoutMessage() {
    if (!this._stack) {    
      let errorNameRegex = /^[0-9a-zA-Z_$]+(:\s+)?\n/;
      this._stack = this.error.stack.replace(this.message, '').replace(errorNameRegex, '');
    }

    return this._stack;
  }

  get stackFrames() {
    if (!this._stackFrames) {
      this._stackFrames = parseStack(this.stackWithoutMessage);
    }

    return this._stackFrames;
  }
}
