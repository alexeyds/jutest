export class IDSequence {
  constructor() {
    this._lastId = 0;
  }

  generateID() {
    this._lastId += 1;
    return this._lastId;
  }
}
