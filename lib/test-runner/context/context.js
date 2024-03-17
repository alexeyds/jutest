import { TestRunnerEventEmitter } from "./event-emitter";
import { RunSummary } from "./run-summary";

export class TestRunnerContext {
  constructor({ fileLocations=[] }={}) {
    this.eventEmitter = new TestRunnerEventEmitter();
    this.fileLocations = fileLocations;
    this.runSummary = new RunSummary();
  }

  static forSingleLocation(file, lineNumber) {
    return new TestRunnerContext({ fileLocations: [{ file, lineNumber }]});
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
