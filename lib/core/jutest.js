import { SpecsContainer } from "./specs-container";

export class Jutest {
  constructor(specsContainer=new SpecsContainer()) {
    this.specsContainer = specsContainer;
  }

  configureNewInstance(configurationFunc) {
    let newInstance = new Jutest(this.specsContainer.copyWithSharedSpecs());

    if (typeof configurationFunc === 'function') {
      configurationFunc(newInstance.specsContainer.toContextAPI());
    }

    newInstance.specsContainer.lockContext(
      `Jutest instances can only be configured inside the configureNewInstance's body, ` +
      `async/delayed configuration is not supported.`
    );

    return newInstance;
  }

  toPublicAPI() {
    let api = this.specsContainer.toBuilderAPI();
    let { describe } = api;

    Object.assign(describe, api);
    describe.configureNewInstance = (...args) => {
      return this.configureNewInstance(...args).toPublicAPI();
    };

    return describe;
  }

  get api() {
    return this.toPublicAPI();
  }

  get specs() {
    return this.specsContainer.specs;
  }

  get specsByFile() {
    return this.specsContainer.specsByFile;
  }
}
