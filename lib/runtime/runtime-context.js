import { RuntimeEventEmitter } from "./runtime-event-emitter";
import { SpecsContainer } from "core";

export class RuntimeContext {
  constructor() {
    this.runtimeEventEmitter = new RuntimeEventEmitter();
    this.specsContainer = new SpecsContainer();
  }
}
