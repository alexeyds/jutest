import { join as joinPath, resolve as resolvePath } from "path";
import glob from "glob";
import jutest from "jutest";

module.exports = function jutestRunner({
  paths=process.argv.slice(2),
  defaultTestDir="test",
  testFilesGlob="/**/*_test.*"
}={}) {
  extractArgvPaths({paths, defaultTestDir}).forEach(p => requireTestFiles(p, { testFilesGlob }));
  jutest.start();
};

function extractArgvPaths({paths, defaultTestDir}) {
  return paths.length === 0 ? [defaultTestDir] : paths;
}

function requireTestFiles(path, { testFilesGlob }) {
  isFile(path) ? requireFile(path) : requireFolder(path, { testFilesGlob });
}

function isFile(path) {
  return /\..+$/.test(path);
}

function requireFolder(path, { testFilesGlob }) {
  let folder = joinPath(path, testFilesGlob);

  glob.sync(folder).forEach(requireFile);
}

function requireFile(path) {
  require(resolvePath(process.cwd(), path));
}
