import { runTest } from "./run-test";

export class Test {
  constructor(name, body, { context }) {
    this.ownName = name;
    this._body = body;
    this._context = context;
  }

  get name() {
    return this._context.testName(this.ownName);
  }

  async run() {
    let result = await runTest(this._body, this._context);
    result.testName = this.name;

    return result;
  }
}
