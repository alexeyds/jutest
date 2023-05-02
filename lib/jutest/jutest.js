import { TestContext } from "core/test-context";
import { testRunner } from "./test-runner";

export class Jutest {
  constructor() {
    this.context = new TestContext();
    this.runner = testRunner;
  }

  toPublicAPI() {
    let { runner, context } = this;

    function jutest(...args) {
      runner.addSuite(...args, { context });
    }

    jutest.test = (...args) => {
      runner.addTest(...args, { context });
    };

    jutest.start = (...args) => runner.run(...args);

    return jutest;
  }
}
