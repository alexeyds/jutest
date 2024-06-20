import { progressReporterPreset } from "./reporter-presets";
import { ReporterConfig } from "reporters";

export const ORDER_TYPES = {
  random: 'random',
  defined: 'defined',
}

export class RuntimeConfig {
  constructor({
    locationsToRun=[],
    includeTestFilePatterns=["*.(test|spec).*"],
    excludeTestFilePatterns=[],
    excludeTestDirectoryPatterns=["/node-modules"],
    seed=randomSeed(),
    order=ORDER_TYPES.random,
    reporters=progressReporterPreset,
    reportersConfig,
  }={}) {
    Object.assign(this, {
      locationsToRun,
      includeTestFilePatterns,
      excludeTestFilePatterns,
      excludeTestDirectoryPatterns,
      seed,
      order,
      reporters,
      reportersConfig: new ReporterConfig(reportersConfig),
    });
  }
}

function randomSeed() {
  return Math.trunc(Math.random() * 85199);
}
