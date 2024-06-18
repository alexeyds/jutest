import fs from "graceful-fs";
import { join, resolve } from "path";

export function readLine(file, lineNumber) {
  return new Promise(resolve => {
    fs.readFile(file, (err, data) => {
      if (err) {
        resolve(readLineFailure(`Unable to read file ${file}`));
      } else {
        let line = lineFromBuffer(data, lineNumber);
        let result = line === undefined ? readLineFailure(`Unable to read line: ${file}:${lineNumber}`) : readLineSuccess(line);
        resolve(result);
      }
    });
  });
}

export function resolveToCwd(path) {
  return resolve(process.cwd(), path);
}

export function isDirectory(path) {
  let stat = fs.lstatSync(path);
  return stat.isDirectory();
}

export function mapDirectory(path, callback) {
  return fs.readdirSync(path).map(item => callback(join(path, item)));
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
