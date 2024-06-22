export class AssertionFailedError extends Error {};
export const jutest: jutest;

type jutest =  describe & SuiteBuilderAPI & JutestConfigurationAPI;

interface JutestConfigurationAPI {
  configureNewInstance: (configure: configurationBuilder) => jutest;
}

type configurationBuilder = (context: TestContextAPI) => void;

interface SuiteBuilderAPI {
  describe: describe;
  xdescribe: describe;
  test: test;
  xtest: test;
}

type describe = (name?: string, body?: suiteBody) => void;
type suiteBody = (suiteApi: SuiteAPI) => void;

type SuiteAPI = TestContextAPI & SuiteBuilderAPI;

interface TestContextAPI {
  assertBeforeTest: testBody;
  assertAfterTest: testBody;
  setup: (assings: Assigns) => any;
  teardown: (assings: Assigns) => void;
  addName: (name: string) => void;
}

type test = (name?: string, body?: testBody) => void;
type testBody = (t: Assertions, assigns: Assigns) => void;

interface Assertions {
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

type twoArgAssertion = (actual: any, expected: any) => void;
type oneArgAsssertion = (actual: any): void;
type includeAssertion = (actual: { includes: (item: any) => any }, expected: any) => void;

interface AsyncAssertions {
  rejects: (promise: any, matcher: any) => Promise;
  passesEventually: (func: function, options?: { timeout: number, interval: number }) => Promise;
}

interface Assigns {
  [key: string]: any;
}
