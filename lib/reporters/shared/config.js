import { resolveToCwd } from "utils/file";

export class ReporterConfig {
  constructor({
    stdout=defaultStdout,
    trackedSourcePaths=['./'],
    ignoredSourcePaths=['node-modules'],
    jutestRunCommand='jutest',
  }={}) {
    this.stdout = stdout;
    this.trackedSourcePaths = trackedSourcePaths.map(resolveToCwd);
    this.ignoredSourcePaths = ignoredSourcePaths.map(resolveToCwd);
    this.jutestRunCommand = jutestRunCommand;
  }
}

function defaultStdout(...args) {
  process.stderr.write(...args);
}
