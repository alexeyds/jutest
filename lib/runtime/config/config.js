import { progressReporterPreset } from "./reporter-presets";
import { resolveToCwd } from "utils/file";

export const ORDER_TYPES = {
  random: 'random',
  defined: 'defined',
};

export class RuntimeConfig {
  static forReporter(reporterConfig) {
    return new RuntimeConfig({ reporterConfig });
  }

  constructor({
    locationsToRun=[],
    includeTestFilePatterns=["*.(test|spec).*"],
    excludeTestFilePatterns=[],
    excludeTestDirectoryPatterns=["/node-modules"],
    seed=randomSeed(),
    order=ORDER_TYPES.random,
    reporters=progressReporterPreset,
    reporterConfig,
  }={}) {
    Object.assign(this, {
      locationsToRun,
      includeTestFilePatterns,
      excludeTestFilePatterns,
      excludeTestDirectoryPatterns,
      seed,
      order,
      reporters,
      reporterConfig: new ReporterConfig(reporterConfig),
    });
  }
}

class ReporterConfig {
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

function randomSeed() {
  return Math.trunc(Math.random() * 85199);
}
