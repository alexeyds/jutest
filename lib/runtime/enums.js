export const RuntimeEvents = {
  RunStart: 'run-start',
  SuiteStart: 'suite-start',
  TestSkip: 'test-skip',
  TestStart: 'test-start',
  TestEnd: 'test-end',
  SuiteEnd: 'suite-end',
  RunEnd: 'run-end',
};

export const SpecTypes = {
  Test: 'test',
  Suite: 'suite',
};

export const ExitReasons = {
  RunEnd: 'run-end',
  TeardownError: 'teardown-error',
  Interrupt: 'interrupt',
};
