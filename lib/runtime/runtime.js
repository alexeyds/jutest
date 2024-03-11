import { RuntimeContext } from "./context";
import { Jutest } from "core";
import { TestRunner } from "./test-runner";

export class Runtime {
  constructor(...args) {
    this.context = new RuntimeContext(...args);
    this.jutest = new Jutest(this.context.specsContainer).toPublicAPI();
    this.runner = new TestRunner(this.context);
  }

  get eventEmitter() {
    return this.context.eventEmitter;
  }

  get specsContainer() {
    return this.context.specsContainer;
  }

  get config() {
    return this.config.config;
  }
}
