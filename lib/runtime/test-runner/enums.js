export const SpecTypes = {
  Test: 'test',
  Suite: 'suite',
};

export const TestStatuses = {
  Passed: 'passed',
  Failed: 'failed',
  Skipped: 'skipped',
};

export const RunEvents = {
  RunStart: 'run-start',
  SuiteSkip: 'suite-skip',
  SuiteStart: 'suite-start',
  TestSkip: 'test-skip',
  TestStart: 'test-start',
  TestEnd: 'test-end',
  SuiteEnd: 'suite-end',
  RunEnd: 'run-end',
};

export const ExitReasons = {
  RunEnd: 'run-end',
  TeardownError: 'teardown-error',
  Interrupt: 'interrupt',
};
