const Events = {
  FileStart: 'file-start',
  SuiteStart: 'suite-start',
  TestSkip: 'test-skip',
  TestStart: 'test-start',
  TestEnd: 'test-end',
  SuiteEnd: 'suite-end',
  FileEnd: 'file-end',
};

const SpecTypes = {
  Test: 'test',
  Suite: 'suite',
};

const ExitReasons = {
  RunEnd: 'run-end',
  Interrupt: 'interrupt',
};

export const TestRunnerEnums = {
  Events,
  SpecTypes,
  ExitReasons,
};
