import { TestRunnerEventEmitter } from "./event-emitter";

export class TestRunnerContext {
  constructor({ fileLocations=[] }={}) {
    this.eventEmitter = new TestRunnerEventEmitter();
    this.fileLocations = fileLocations;
  }

  static forSingleLocation(file, lineNumber) {
    return new TestRunnerContext({ fileLocations: [{ file, lineNumber }]});
  }

  isFileRunnable(file) {
    if (this.fileLocations.length === 0) {
      return true;
    } else {
      return this.fileLocations.some(f => f.file === file);
    }
  }

  isLocationRunnable(file, lineNumber) {
    if (this.fileLocations.length === 0) {
      return true;
    }

    let locations = this.fileLocations.filter(l => l.file === file);

    if (locations.length > 0) {
      return locations.some(l => l.lineNumber === lineNumber || !l.lineNumber);
    } else {
      return false;
    }
  }
}
