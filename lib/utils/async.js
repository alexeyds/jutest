export class AsyncJob {
  constructor(runner) {
    this.wasRun = false;
    this.result = undefined;
    this.runner = runner;
  }

  run() {
    this._promise = this._promise || this._run();
    return this._promise;
  }

  async _run() {
    this.result = await this.runner();
    this.wasRun = true;

    return this.result;
  }
}

export function createOrderedResolver(asyncFunctions) {
  return async (...args) => {
    for (let func of asyncFunctions) {
      await func(...args);
    }
  };
}
