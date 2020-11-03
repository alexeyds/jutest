import * as Assertions from 'assertions';

export default class Test {
  constructor({name, body}) {
    this.name = name;
    this._body = body;
  }

  run() {
    try {
      this._body(Assertions);
      return { passed: true, error: null };
    } catch(e) {
      return { passed: false, error: e };
    }
  }
}
