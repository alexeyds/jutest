import { progressReporterPreset } from "./reporter-presets";
import { resolveToCwd } from "utils/file";

export const ORDER_TYPES = {
  random: 'random',
  defined: 'defined',
};

export class RuntimeConfig {
  constructor({
    locationsToRun=[],
    includeTestFilePatterns=["*.(test|spec).*"],
    excludeTestFilePatterns=[],
    excludeTestDirectoryPaths=['node-modules'],
    seed=randomSeed(),
    order=ORDER_TYPES.random,
    stdout=defaultStdout,
    trackedSourcePaths=['./'],
    ignoredSourcePaths=['node-modules'],
    jutestRunCommand='jutest',
    reporters=progressReporterPreset,
  }={}) {

    Object.assign(this, {
      locationsToRun: locationsToRun.map(resolveToCwd),
      includeTestFilePatterns,
      excludeTestFilePatterns,
      excludeTestDirectoryPaths: excludeTestDirectoryPaths.map(resolveToCwd),
      seed,
      order,
      stdout,
      trackedSourcePaths: trackedSourcePaths.map(resolveToCwd),
      ignoredSourcePaths: ignoredSourcePaths.map(resolveToCwd),
      jutestRunCommand,
      reporters,
    });
  }
}

function defaultStdout(...args) {
  process.stderr.write(...args);
}

function randomSeed() {
  return Math.trunc(Math.random() * 85199);
}
