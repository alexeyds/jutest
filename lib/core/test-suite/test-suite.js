import { AsyncJob } from "utils/async-job";
import { SourceLocator } from "utils/source-locator";
import { composeTestSuite } from "./compose-test-suite";

export class TestSuite {
  constructor(name, body, { context }) {
    this.sourceLocator = new SourceLocator({ sourceError: new Error() });

    context = context.copy();
    context.addName(name);
    this._context = context;

    this._composingJob = new AsyncJob(() => composeTestSuite(body, this._context));
  }

  get name() {
    return this._context.name;
  }

  composeSpecs() {
    return this._composingJob.run();
  }

  get isComposed() {
    return this._composingJob.wasRun;
  }

  get isASuite() {
    return true;
  }
}
