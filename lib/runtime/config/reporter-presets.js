import { ProgressReporter, SummaryReporter, FailedTestsReporter, RerunnableLocationsReporter } from 'reporters';

export let progressReporterPreset = [
  ProgressReporter,
  FailedTestsReporter,
  SummaryReporter,
  RerunnableLocationsReporter,
];
