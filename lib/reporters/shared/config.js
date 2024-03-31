import { resolveToCwd } from "utils/file";

export class ReporterConfig {
  constructor({
    stdout=defaultStdout,
    includeSourceDirs=['./'],
    excludeSourceDirs=['node-modules']
  }={}) {
    this.stdout = stdout;
    this.includeSourceDirs = includeSourceDirs.map(resolveToCwd);
    this.excludeSourceDirs = excludeSourceDirs.map(resolveToCwd);
  }
}

function defaultStdout(...args) {
  process.stderr.write(...args);
}
