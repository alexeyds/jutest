export class Job {
  constructor(runner) {
    this.wasRun = false;
    this.result = undefined;
    this.runner = runner;
  }

  run() {
    if (this.wasRun) return this.result;

    this.result = this.runner();
    this.wasRun = true;
    return this.result;
  }
}

export class AsyncJob extends Job {
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
