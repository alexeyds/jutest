import { AsyncJob } from "utils/async";
import { TestSourceLocator } from "utils/test-source-locator";
import { composeTestSuite } from "./compose-test-suite";

export class TestSuite {
  constructor(name, body, { specsContainer, skip=false, tags }) {
    specsContainer = specsContainer.copy({ skip });

    this._specsContainer = specsContainer;
    this._context.addName(name);
    this._context.addTags(tags);

    this.sourceLocator = new TestSourceLocator({
      sourceError: new Error(),
      sourceFilePath: this._specsContainer.sourceFilePath
    });

    this.ownName = name;

    this._composingJob = new AsyncJob(() => composeTestSuite(body, specsContainer));
  }

  get name() {
    return this._context.name;
  }

  get tags() {
    return this._context.tags;
  }

  async composeSpecs() {
    let { specs } = await this._composingJob.run();
    return specs;
  }

  get isComposed() {
    return this._composingJob.wasRun;
  }

  get isASuite() {
    return true;
  }

  get contextId() {
    return this._context.id;
  }

  get parentContextIds() {
    return this._context.parentIds;
  }

  get skipped() {
    return this._specsContainer.skip;
  }

  get testsCount() {
    return this._composingJob.result?.testsCount || 0;
  }

  get _context() {
    return this._specsContainer.context;
  }
}
