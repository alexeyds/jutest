import { RuntimeEventEmitter } from "./runtime-event-emitter";
import { RuntimeConfig } from "./runtime-config";
import { SpecsContainer } from "core";

export class RuntimeContext {
  constructor(...args) {
    this.config = new RuntimeConfig(...args);
    this.eventEmitter = new RuntimeEventEmitter();
    this.specsContainer = new SpecsContainer();
  }
}
