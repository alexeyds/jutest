import { Test, TestSuite, TestContext } from "core";
import { createDelegator } from "utils/delegator";
import { Container } from "./container";

export class SpecsContainer {
  constructor({
    context=new TestContext(),
    skip=false,
    sourceFilePath,
  }={}) {
    this.context = context;
    this.skip = skip;
    this.sourceFilePath = sourceFilePath;

    this._container = new Container();
  }

  get specs() {
    return this._container.items;
  }

  copy({ skip=this.skip }={}) {
    return new SpecsContainer({
      context: this.context.copy(),
      skip,
      sourceFilePath: this.sourceFilePath,
    });
  }

  extend() {
    let copy = this.copy();
    copy._container = this._container;

    return copy;
  }

  async withSourceFilePath(path, func) {
    let oldValue = this.sourceFilePath;
    this.sourceFilePath = path;

    try {
      await func();
    } finally {
      this.sourceFilePath = oldValue;
    }
  }

  lock(...args) {
    this.lockContainer(...args);
  }

  lockContainer(...args) {
    this._container.lock(...args);
  }

  lockContext(...args) {
    this.context.lock(...args);
  }

  toSuiteAPI() {
    return {
      ...this.toContextAPI(),
      ...this.toBuilderAPI(),
    };
  }

  toContextAPI() {
    return this.context.toConfigurationAPI();
  }

  toBuilderAPI() {
    return createDelegator(this, {
      test: true,
      xtest: true,
      describe: true,
      xdescribe: true,
    });
  }

  test = this._createTestBuilder();
  xtest = this._createTestBuilder({ skip: true });
  describe = this._createSuiteBuilder();
  xdescribe = this._createSuiteBuilder({ skip: true });

  _createTestBuilder({ skip }={}) {
    return (name, body) => {
      let { context, sourceFilePath } = this;
      skip = skip || this.skip;

      this._container.push(new Test(name, body, { context, skip, sourceFilePath }));
    };
  }

  _createSuiteBuilder({ skip }={}) {
    return (name, body) => {
      skip = skip || this.skip;

      this._container.push(new TestSuite(name, body, { specsContainer: this, skip }));
    };
  }
}
