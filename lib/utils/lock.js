export class Lock {
  constructor() {
    this.isLocked = false;
    this._errorMessage;
  }

  lock(errorMessage) {
    this._errorMessage = errorMessage;
    this.isLocked = true;
  }

  throwIfLocked() {
    if (this.isLocked) {
      throw new Error(this._errorMessage);
    }
  }
}
