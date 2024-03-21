export let fileWithLineNumberRegexp = /(.*?)((?::\d+)+)/;

export function fileLocation(file, lineNumbers=[]) {
  return { file, lineNumbers };
}

export function parseFileLocation(filePath) {
  let match = filePath.match(new RegExp('^' + fileWithLineNumberRegexp.source + '$'));

  if (match) {
    let [, file, lineNumbers] = match;
    lineNumbers = lineNumbers.substring(1).split(':').map(l => parseInt(l));
    return fileLocation(file, lineNumbers);
  } else {
    return fileLocation(filePath);
  }
}
