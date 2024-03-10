import { Test } from "core/test";
import { TestSuite } from "core/test-suite";
import { Container } from "./container";

export class SpecsContainer {
  constructor({ skip=false }={}) {
    this.container = new Container();
    this.context;
    this.parentSpecsContainer;

    this._skip = skip;
  }

  get specs() {
    return this.container.items;
  }

  copy() {

  }

  toSuiteAPI() {

  }

  toConfigurationAPI() {

  }

  toBuilderAPI({ context }) {
    return {
      describe: this._createSuiteBuilder({ context, skip: this._skip }),
      test: this._createTestBuilder({ context, skip: this._skip }),
      xtest: this._createTestBuilder({ context, skip: true }),
      xdescribe: this._createSuiteBuilder({ context, skip: true }),
    };
  }

  setSourceFilePath(filePath) {
    this.currentSourceFilePath = filePath;
  }

  async withSourceFilePath(filePath, func) {
    let oldValue = this.currentSourceFilePath;
    this.currentSourceFilePath = filePath;

    try {
      await func();
    } finally {
      this.currentSourceFilePath = oldValue;
    }
  }

  lock(...args) {
    this.container.lock(...args);
  }

  lockContainer() {

  }

  lockContext() {
    
  }

  _createTestBuilder(...args) {
    return this._createSpecBuilder(Test, ...args);
  }

  _createSuiteBuilder(...args) {
    return this._createSpecBuilder(TestSuite, ...args);
  }

  _createSpecBuilder(SpecClass, { context, skip }) {
    return (name, body) => {
      this.container.push(new SpecClass(name, body, { context, skip, sourceFilePath: this.currentSourceFilePath }));
    };
  }
}
