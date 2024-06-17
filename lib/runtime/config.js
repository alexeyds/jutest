import { ReporterConfig } from "reporters";

export class RuntimeConfig {
  constructor({
    locationsToRun=[],
    includeTestFilePatterns=["*.test.*"],
    excludeTestFilePatterns=[],
    excludeTestDirectoryPatterns=[],
    reportersConfig
  }={}) {
    Object.assign(this, {
      locationsToRun,
      includeTestFilePatterns,
      excludeTestFilePatterns,
      excludeTestDirectoryPatterns,
      reportersConfig: new ReporterConfig(reportersConfig),
    });
  }
}
