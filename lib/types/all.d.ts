// jutest
export interface Jutest extends Describe, SuiteBuilderAPI {
  configureNewInstance: ConfigureNewInstance;
}

export interface ConfigureNewInstance {
  (jutestBuilder: (api: TestContextAPI) => void): Jutest;
}

export interface Describe {
  (name?: string, body?: SuiteBody): void;
  (name: string, tags: Tags, body: SuiteBody): void;
}

export interface Test {
  (name?: string, body?: TestBody): void;
  (name: string, tags: Tags, body: TestBody): void;
}

export interface SuiteBody {
  (suiteApi: SuiteAPI): void;
}

export interface SuiteAPI extends TestContextAPI, SuiteBuilderAPI {};

export interface SuiteBuilderAPI {
  describe: Describe;
  xdescribe: Describe;
  test: Test;
  xtest: Test;
}

export interface TestContextAPI {
  assertBeforeTest: (body: TestBody) => void;
  assertAfterTest: (body: TestBody) => void;
  setup: Setup;
  teardown: Teardown;
  addName: (name: string) => void;
  addTags: (tags: Tags) => void;
}

export interface Setup {
  (setupFunc: (assigns: Assigns, tags: Tags) => Assigns | void): void;
}

export interface Teardown {
  (teardownFunc: (assigns: Assigns, tags: Tags) =>  void): void;
}

export interface TestBody {
  (t: Assertions, assigns: Assigns): void;
}

export interface Assertions {
  same: twoArgAssertion;
  notSame: twoArgAssertion;
  match: twoArgAssertion;
  doesNotMatch: twoArgAssertion;
  fail: (failureMessage: any) => void;
  equal: twoArgAssertion;
  notEqual: twoArgAssertion;
  assert: oneArgAsssertion;
  refute: oneArgAsssertion;
  throws: (expression: function, matcher: any) => void;
  includes: includeAssertion;
  exclude: includeAssertion;
  async: AsyncAssertions;
}

export type twoArgAssertion = (actual: any, expected: any) => void;
export type oneArgAsssertion = (actual: any) => void;
export type includeAssertion = (actual: { includes: (item: any) => any }, expected: any) => void;

export interface AsyncAssertions {
  rejects: (promise: any, matcher: any) => Promise;
  passesEventually: (func: function, options?: { timeout?: number, interval?: number }) => Promise;
}

export interface Assigns {
  [key: string]: any;
}

// shared
export interface CLIInit {
  runtimeConfig: RuntimeConfigParams;
  configFilePath?: string;
  parsedArgv: { [key: string]: any };
}

export interface ReporterClass {
  initializeReporter: (config: RuntimeConfig, eventEmitter: TestRunnerEventEmitter) => Reporter;
}

export interface Reporter {
  finishReporting?: (runSummaries: RunSummary) => void;
}

export interface RuntimeConfig {
  locationsToRun: Location[];
  includeTestFilePatterns: string[];
  excludeTestFilePatterns: string[];
  excludeTestDirectoryPaths: string[];
  seed: number;
  order: ORDER_TYPES;
  stdout: (buffer: string) => void;
  trackedSourcePaths: string[];
  ignoredSourcePaths: string[];
  jutestRunCommand: string;
  reporters: ReporterClass[];
  onlyIncludeTags: Tags;
  excludeTags: Tags;
}

export interface RuntimeConfigParams extends Partial<RuntimeConfig> {
  locationsToRun?: string[];
}

export interface Location {
  file: string;
  lineNumbers: number[];
}

export interface TestRunnerEventEmitter {
  on: TestRunnerOnEvent;
  off: (event: string, listener: function) => void;
}

export interface TestRunnerOnEvent {
  (event: 'file-start' | 'file-end', listener: (file: string) => void): void;
  (event: 'suite-start' | 'suite-end', listener: (suiteSummary: SuiteSummary) => void): void;
  (event: 'test-start' | 'test-end' | 'test-skip', listener: (testSummary: TestSummary) => void): void;
}

export interface RunSummary {
  success: boolean;
  runTime: number;
  exitReason: 'run-end' | 'interrupt';
  totalTestsCount: number;
  runTestsCount: number;
  passedTestsCount: number;
  skippedTestsCount: number;
  failedTestsCount: number;
  fileLoadTimes: Array<{
    file: string;
    loadTime: number;
  }>;
  testSummaries: Array<SuiteSummary | TestSummary>;
}

export interface SuiteSummary extends SpecSummary {
  type: 'suite';
  testsCount: number;
}

export interface TestSummary extends SpecSummary {
  type: 'test';
  runTime: number;
  executionResult: TestResult;
}

export interface TestResult {
  status: 'passed' | 'failed' | 'skipped';
  error: any;
  skipReason: string | null;
}

export interface SpecSummary {
  name: string;
  ownName: string;
  contextId: number;
  parentContextIds: number[];
  definitionLocation: {
    file?: string;
    lineNumber?: number;
  };
}

export type TestRunnerEvents = 'file-start' | 'suite-start' | 'test-skip' | 'test-start' | 'test-end' | 'suite-end' | 'file-end';

export interface Tags {
  [key: string]: any;
}
