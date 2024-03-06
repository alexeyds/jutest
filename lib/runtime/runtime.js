import { RuntimeContext } from "./runtime-context";
import { Jutest } from "./jutest";
import { TestRunner } from "./test-runner";
import { FilesLoader } from "./files-loader";

export class Runtime {
  constructor() {
    this.context = new RuntimeContext();
    this.jutest = new Jutest(this.context).toPublicAPI();
    this.runner = new TestRunner(this.context);
    this.filesLoader = new FilesLoader(this.context);
  }

  get eventEmitter() {
    return this.context.eventEmitter;
  }

  get specsContainer() {
    return this.context.specsContainer;
  }
}
