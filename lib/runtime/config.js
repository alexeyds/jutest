import { progressReporterPreset } from "./utils/reporter-presets";
import { ReporterConfig } from "reporters";

export class RuntimeConfig {
  constructor({
    locationsToRun=[],
    includeTestFilePatterns=["*.(test|spec).*"],
    excludeTestFilePatterns=[],
    excludeTestDirectoryPatterns=["/node-modules"],
    reporters=progressReporterPreset,
    reportersConfig
  }={}) {
    Object.assign(this, {
      locationsToRun,
      includeTestFilePatterns,
      excludeTestFilePatterns,
      excludeTestDirectoryPatterns,
      reporters,
      reportersConfig: new ReporterConfig(reportersConfig),
    });
  }
}
