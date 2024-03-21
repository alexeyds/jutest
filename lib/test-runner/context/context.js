import { TestRunnerEventEmitter } from "./event-emitter";
import { fileLocation } from "utils/file-location";
import { RunSummary } from "./run-summary";

export class TestRunnerContext {
  constructor({ fileLocations=[] }={}) {
    this.eventEmitter = new TestRunnerEventEmitter();
    this.fileLocations = fileLocations;
    this.runSummary = new RunSummary();

    this._locationsWithLineNumber = fileLocations.filter(l => l.lineNumbers.length);
  }

  static forSingleLocation(file, lineNumbers) {
    return new TestRunnerContext({ fileLocations: [fileLocation(file, lineNumbers)] });
  }

  isLocationRunnable(file, lineNumbers=[]) {
    if (this._locationsWithLineNumber.length === 0) {
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
