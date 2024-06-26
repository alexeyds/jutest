import { RuntimeConfigParams, CLIInit, ReporterClass } from "./all.d.ts";

export function initRuntime(configParams: RuntimeConfigParams): void;
export function initCLI(): CLIInit;
export const reporterPresets: {
  progressReporterPreset: Array<ReporterClass>,
};
