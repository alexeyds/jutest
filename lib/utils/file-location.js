export function fileLocation(file, lineNumber) {
  return { file, lineNumber };
}

export function parseFileLocations(filePath) {
  let match = filePath.match(/^(.*?)((?::\d+)+)$/);

  if (match) {
    let [, file, lineNumbers] = match;

    return lineNumbers
      .substring(1)
      .split(':')
      .map(l => parseInt(l))
      .map(l => fileLocation(file, l));
  } else {
    return [fileLocation(filePath)];
  }
}
