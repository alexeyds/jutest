const Events = {
  SuiteStart: 'suite-start',
  TestSkip: 'test-skip',
  TestStart: 'test-start',
  TestEnd: 'test-end',
  SuiteEnd: 'suite-end',
};

const SpecTypes = {
  Test: 'test',
  Suite: 'suite',
};

const ExitReasons = {
  RunEnd: 'run-end',
  TeardownError: 'teardown-error',
  Interrupt: 'interrupt',
};

export const TestRunnerEnums = {
  Events,
  SpecTypes,
  ExitReasons,
};
