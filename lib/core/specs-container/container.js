import { Lock } from "utils/lock";

export class Container {
  constructor() {
    this._lock = new Lock();
    this.itemsByKey = {};
    this.items = [];
  }

  addItem(key, item) {
    this._lock.throwIfLocked();

    this.itemsByKey[key] = this.itemsByKey[key] || [];
    this.itemsByKey[key].push(item);
    this.items.push(item);

    return item;
  }

  lock(...args) {
    this._lock.lock(...args);
  }
}
