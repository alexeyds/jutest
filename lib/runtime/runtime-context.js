import { RuntimeEventEmitter } from "./runtime-event-emitter";
import { SpecsContainer } from "core";

export class RuntimeContext {
  constructor() {
    this.eventEmitter = new RuntimeEventEmitter();
    this.specsContainer = new SpecsContainer();
  }
}
