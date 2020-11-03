import * as Expectations from 'expectations';

export default class Test {
  constructor({name, body}) {
    this.name = name;
    this._body = body;
  }

  run() {
    try {
      this._body(Expectations);
      return { passed: true, error: null, testName: this.name };
    } catch(e) {
      return { passed: false, error: e, testName: this.name };
    }
  }
}
