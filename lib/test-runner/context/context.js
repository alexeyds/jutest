import { TestRunnerEventEmitter } from "./event-emitter";
import { RunSummary } from "./run-summary";

export class TestRunnerContext {
  constructor({ fileLocations=[] }={}) {
    this.eventEmitter = new TestRunnerEventEmitter();
    this.fileLocations = fileLocations;
    this.runSummary = new RunSummary();

    this._locationsWithLineNumber = fileLocations.filter(l => l.lineNumber);
  }

  static forSingleLocation(file, lineNumber) {
    return new TestRunnerContext({ fileLocations: [{ file, lineNumber }]});
  }

  isLocationRunnable(file, lineNumber) {
    if (this._locationsWithLineNumber.length === 0) {
      return true;
    }

    let locations = this._locationsWithLineNumber.filter(l => l.file === file);

    if (locations.length > 0) {
      return locations.some(l => {
        let target = l.lineNumber;
        return target === lineNumber || target === lineNumber - 1 || target === lineNumber + 1;
      });
    } else {
      return true;
    }
  }
}
