import { resolveToCwd } from "utils/file";

export class ReporterConfig {
  constructor({
    stdout=defaultStdout,
    trackedSourcePaths=['./'],
    ignoredSourcePaths=['node-modules']
  }={}) {
    this.stdout = stdout;
    this.trackedSourcePaths = trackedSourcePaths.map(resolveToCwd);
    this.ignoredSourcePaths = ignoredSourcePaths.map(resolveToCwd);
  }
}

function defaultStdout(...args) {
  process.stderr.write(...args);
}
