import { Test, TestSuite, TestContext } from "core";
import { createDelegator } from "utils/delegator";
import { Container } from "./container";

export class SpecsContainer {
  constructor({
    context=new TestContext(),
    skip=false,
    sourceFilePath=null,
  }={}) {
    this.context = context;
    this.skip = skip;
    this.sourceFilePath = sourceFilePath;

    this._container = new Container();
  }

  get specs() {
    return this._container.items;
  }

  get specsByFile() {
    return this._container.itemsByKey;
  }

  copy({ skip=this.skip }={}) {
    return new SpecsContainer({
      context: this.context.copy(),
      skip,
      sourceFilePath: this.sourceFilePath,
    });
  }

  copyWithSharedSpecs(...args) {
    let copy = this.copy(...args);
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
    }, { hideReturnValues: true });
  }

  test(name, body) {
    return this._addTest(name, body, { skip: this.skip });
  }

  xtest(name, body) {
    return this._addTest(name, body, { skip: true });
  }

  describe(name, body) {
    return this._addSuite(name, body, { skip: this.skip });
  }

  xdescribe(name, body) {
    return this._addSuite(name, body, { skip: true });
  }

  _addTest(name, body, { skip }) {
    let { context, sourceFilePath } = this;
    let test = new Test(name, body, { context, skip, sourceFilePath });

    return this._container.addItem(sourceFilePath, test);
  }

  _addSuite(name, body, { skip }) {
    let { sourceFilePath } = this;
    let suite = new TestSuite(name, body, { specsContainer: this, skip });

    return this._container.addItem(sourceFilePath, suite);
  }
}
