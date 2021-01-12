import fs from "fs";

export function readLine(file, lineNumber) {
  return new Promise(resolve => {
    fs.readFile(file, (err, data) => {
      if (err) {
        resolve(readLineFailure(`Unable to read file ${file}`));
      } else {
        let line = lineFromBuffer(data, lineNumber);
        let result = line === undefined ? readLineFailure(`Unable to read line ${lineNumber} in ${file}`) :readLineSuccess(line);
        resolve(result);
      }
    });
  });
}

function lineFromBuffer(buffer, lineNumber) {
  return buffer.toString().split('\n')[lineNumber-1];
}

function readLineSuccess(line) {
  return { success: true, error: null, line };
}

function readLineFailure(error) {
  return { success: false, error, line: null };
}
