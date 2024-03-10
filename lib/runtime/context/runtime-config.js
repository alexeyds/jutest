export class RuntimeConfig {
  constructor({ fileLocations=[] }={}) {
    this.fileLocations = fileLocations;
    this._locationsWithLineNumber = this.fileLocations.filter(l => l.lineNumber);
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