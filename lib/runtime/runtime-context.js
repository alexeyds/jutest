import { RuntimeEventEmitter } from "./runtime-event-emitter";
import { SpecsContainer } from "core";

export class RuntimeContext {
  constructor(config={}) {
    let defaultConfig = {
      fileLocations: [],
    };

    this.config = Object.assign(defaultConfig, config);
    this.eventEmitter = new RuntimeEventEmitter();
    this.specsContainer = new SpecsContainer();
  }
}
