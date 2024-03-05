import { formatStackFrames } from "utils/error-formatting";

export class SourceLocator {
  constructor({ sourceError=new Error(), sourceFilePath }={}) {
    this._sourceError = sourceError;

    if (sourceFilePath) {
      this.sourceFilePath = sourceFilePath;
      this.lineNumber = this.guessLineNumberInFile(sourceFilePath);
    }
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
