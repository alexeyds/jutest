import { AsyncJob } from "utils/async-job";
import { SourceLocator } from "utils/source-locator";
import { composeTestSuite } from "./compose-test-suite";

export class TestSuite {
  constructor(name, body, { specsContainer, skip=false }) {
    specsContainer = specsContainer.copy({ skip });

    this._specsContainer = specsContainer;
    this._context.addName(name);

    this.sourceLocator = new SourceLocator({
      sourceError: new Error(),
      sourceFilePath: this._specsContainer.sourceFilePath
    });

    this.ownName = name;

    this._composingJob = new AsyncJob(() => composeTestSuite(body, specsContainer));
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

  get contextId() {
    return this._context.id;
  }

  get parentContextIds() {
    return this._context.parentIds;
  }

  get skipped() {
    return this._specsContainer.skip;
  }

  get _context() {
    return this._specsContainer.context;
  }
}
