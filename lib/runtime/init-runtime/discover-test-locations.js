import micromatch from "micromatch";
import { resolveToCwd, isDirectory, mapDirectory } from "utils/file";
import { parseFileLocation, fileLocation } from "utils/file-location";

export function discoverTestLocations(runtimeConfig) {
  let locations = [];

  runtimeConfig.locationsToRun.forEach(l => {
    let location = parseFileLocation(resolveToCwd(l));

    let { file: locationPath } = location;

    if (isDirectory(locationPath)) {
      locations.push(...findFiles(locationPath, runtimeConfig).map(l => fileLocation(l)));
    } else {
      locations.push(location);
    }
  });

  return locations;
}

function findFiles(dirPath, runtimeConfig) {   
  let files = [];

  mapDirectory(dirPath, path => {
    files.push(...recursivelyFindFiles(path, dirPath, runtimeConfig))
  });

  return files;
}

function recursivelyFindFiles(path, parentDirPath, runtimeConfig) {
  if (isDirectory(path)) {
    return isValidTestDirectory(path, parentDirPath, runtimeConfig) ? findFiles(path, runtimeConfig) : [];
  } else {
    return isValidTestFile(path, runtimeConfig) ? [path] : [];
  }
}


function isValidTestDirectory(dirPath, parentDirPath, runtimeConfig) {
  dirPath = dirPath.replace(parentDirPath, '');
  let { excludeTestDirectoryPatterns } = runtimeConfig;

  return !micromatch.some(dirPath, excludeTestDirectoryPatterns);
}

function isValidTestFile(filePath, runtimeConfig) {
  let { includeTestFilePatterns, excludeTestFilePatterns } = runtimeConfig;

  return (
    micromatch.some(filePath, includeTestFilePatterns, { matchBase: true }) &&
    !micromatch.some(filePath, excludeTestFilePatterns, { matchBase: true })
  );
}
