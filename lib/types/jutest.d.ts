export class AssertionFailedError extends Error {};
export const jutest: Jutest;

interface Jutest extends Describe, SuiteBuilderAPI {
  configureNewInstance: ConfigureNewInstance;
}

interface ConfigureNewInstance {
  (jutestBuilder: (api: TestContextAPI) => void): Jutest;
}

interface Describe {
  (name?: string, body?: SuiteBody): void;
  (name: string, tags: Tags, body: SuiteBody): void;
}
interface Test {
  (name?: string, body?: TestBody): void;
  (name: string, tags: Tags, body: TestBody): void;
}

interface SuiteBody {
  (suiteApi: SuiteAPI): void;
}

interface SuiteAPI extends TestContextAPI, SuiteBuilderAPI {};

interface SuiteBuilderAPI {
  describe: Describe;
  xdescribe: Describe;
  test: Test;
  xtest: Test;
}

interface TestContextAPI {
  assertBeforeTest: TestBody;
  assertAfterTest: TestBody;
  setup: Setup;
  teardown: Teardown;
  addName: (name: string) => void;
  addTags: (tags: Tags) => void;
}

interface Setup {
  (setupFunc: (assigns: Assigns, tags: Tags) => Assigns | void): void;
}

interface Teardown {
  (teardownFunc: (assigns: Assigns, tags: Tags) =>  void): void;
}

interface TestBody {
  (t: Assertions, assigns: Assigns): void;
}

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
type oneArgAsssertion = (actual: any) => void;
type includeAssertion = (actual: { includes: (item: any) => any }, expected: any) => void;

interface AsyncAssertions {
  rejects: (promise: any, matcher: any) => Promise;
  passesEventually: (func: function, options?: { timeout?: number, interval?: number }) => Promise;
}

interface Tags {
  [key: string]: any;
}

interface Assigns {
  [key: string]: any;
}
