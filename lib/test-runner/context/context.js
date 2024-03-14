import { TestRunnerEventEmitter } from "./event-emitter";

export class TestRunnerContext {
  constructor({ fileLocations=[] }={}) {
    this.fileLocations = fileLocations;
    this.eventEmitter = new TestRunnerEventEmitter();
    this._locationsWithLineNumber = this.fileLocations.filter(l => l.lineNumber);
  }

  static forSingleLocation(file, lineNumber) {
    return new TestRunnerContext({ fileLocations: [{ file, lineNumber }]});
  }

  isLocationRunnable(file, lineNumber) {
    let locations = this._locationsWithLineNumber.filter(l => l.file === file);

    if (locations.length > 0) {
      return locations.some(l => l.lineNumber === lineNumber);
    } else {
      return true;
    }
  }
}
