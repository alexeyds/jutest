import { formatStackFrames } from "utils/error-formatting";

export class SourceLocator {
  constructor({ sourceError=new Error() }={}) {
    this._sourceError = sourceError;
  }

  setSourceFile(filePath) {
    this.filePath = filePath;
    this.lineNumber = this.guessLineNumberInFile(filePath);
  }

  get locations() {
    if (!this._locations) {
      let frames = formatStackFrames(this._sourceError);

      this._locations = frames.map(stackFrame => ({
        stackFrame,
        lineNumber: detectLineNumber(stackFrame),
      }));
    }

    return this._locations;
  }

  guessLineNumberInFile(file) {
    let location = this.locations.reverse().find(l => l.stackFrame.includes(file));
    return location?.lineNumber;
  }
}

function detectLineNumber(stackFrame) {
  let matchData = [...stackFrame.matchAll(/:(\d+)/g)];
  let numbers = matchData.map(a => parseInt(a[1]));

  return numbers[0];
}
