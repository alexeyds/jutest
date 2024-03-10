import { Lock } from "utils/lock";

export class Container {
  constructor() {
    this._lock = new Lock();
    this.items = [];
  }

  push(...args) {
    this._lock.throwIfLocked();
    return this.items.push(...args);
  }

  lock(...args) {
    this._lock.lock(...args);
  }
}
