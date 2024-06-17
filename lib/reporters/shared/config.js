import { resolveToCwd } from "utils/file";

export class ReporterConfig {
  constructor({
    stdout=defaultStdout,
    trackedSourcePaths=['./'],
    ignoredSourcePaths=['node-modules'],
    jutestRunCommand='jutest',
  }={}) {
    Object.assign(this, {
      stdout,
      trackedSourcePaths: trackedSourcePaths.map(resolveToCwd),
      ignoredSourcePaths: ignoredSourcePaths.map(resolveToCwd),
      jutestRunCommand,
    })
  }
}

function defaultStdout(...args) {
  process.stderr.write(...args);
}
