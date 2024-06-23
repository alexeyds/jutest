import { TestRunnerEventEmitter } from "./event-emitter";
import { fileLocation } from "utils/file-location";
import { RunSummary } from "./run-summary";

export class TestRunnerContext {
  constructor({ fileLocations=[], requireFunc=require, randomizeOrder=false, seed }={}) {
    Object.assign(this, {
      fileLocations,
      requireFunc,
      eventEmitter: new TestRunnerEventEmitter(),
      runSummary: new RunSummary(),
      randomizeOrder,
      seed,
    });

    this._locationsWithLineNumber = fileLocations.filter(l => l.lineNumbers.length);
  }

  static forSingleLocation(file, lineNumbers) {
    return new TestRunnerContext({
      fileLocations: [fileLocation(file, lineNumbers)]
    });
  }

  static forSingleFile(file, config) {
    return new TestRunnerContext({
      ...config,
      fileLocations: [fileLocation(file)]
    });
  }

  get hasNoLineNumberLocations() {
    return this._locationsWithLineNumber.length === 0;
  }

  isLocationRunnable(file, lineNumbers=[]) {
    if (this.hasNoLineNumberLocations) {
      return true;
    }

    let locations = this._locationsWithLineNumber.filter(l => l.file === file);

    if (locations.length > 0) {
      return locations.some(l => lineNumbers.some(n => l.lineNumbers.includes(n)));
    } else {
      return true;
    }
  }
}
