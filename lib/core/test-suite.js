import { SpecsContainer } from "core/specs-container";
import { AsyncJob } from "utils/async-job";
import { SourceLocator } from "utils/source-locator";

export class TestSuite {
  constructor(name, body, { context }) {
    this.sourceLocator = new SourceLocator({ sourceError: new Error() });

    context = context.copy();
    context.addName(name);
    this._context = context;

    this._specsContainer = new SpecsContainer({ TestSuite });

    this._composingJob = new AsyncJob(() => composeSuite(this, body));
  }

  get name() {
    return this._context.name;
  }

  get specs() {
    return this._composingJob.result;
  }

  get isReady() {
    return this._composingJob.wasRun;
  }

  get isASuite() {
    return true;
  }

  compose() {
    return this._composingJob.run();
  }

  _lock() {
    this._context.lock(
      `Test context for "${this.name}" suite is locked and cannot be modified. `+
      `Make sure that you only add setups, teardowns, etc. inside the test suite's body.`
    );

    this._specsContainer.lock(
      `Test suite "${this.name}" is locked and doesn't accept new tests/suites. `+
      `Make sure that your tests are only registered from within the given test suite's body.`
    );
  }
}

async function composeSuite(suite, body) {
  let suiteBuilder = createSuiteBuilder(suite);

  await body(suiteBuilder);
  suite._lock();

  for (let item of suite._specsContainer.specs) {
    if (item.isASuite) await item.compose();
  }

  return suite._specsContainer.specs;
}

function createSuiteBuilder(suite) {
  let suiteBuilder = new SuiteBuilder();

  Object.assign(suiteBuilder, suite._context.toConfigurationAPI());

  suiteBuilder.test = (name, body) => {
    suite._specsContainer.addTest(name, body, { context: suite._context });
  };

  suiteBuilder.describe = (name, body) => {
    suite._specsContainer.addSuite(name, body, { context: suite._context });
  };

  return suiteBuilder;
}

class SuiteBuilder {}
