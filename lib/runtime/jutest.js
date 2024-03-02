import { TestContext } from "core";

export class Jutest {
  constructor({ specsContainer, context=new TestContext() }) {
    this.specsContainer = specsContainer;
    this.context = context;
  }

  toPublicAPI() {
    let { specsContainer, context } = this;

    let builderAPI = specsContainer.toBuilderAPI({ context });
    let jutest = builderAPI.describe;
    Object.assign(jutest, builderAPI);

    jutest.configureNewInstance = (configure) => {
      let newContext = context.copy();
      let newInstance = new Jutest({
        specsContainer,
        context: newContext,
      });

      configure && configure(newContext.toConfigurationAPI());
      newContext.lock("Jutest instances can only be configured inside the configureNewInstance's body, async/delayed configuration is not supported.");

      return newInstance.toPublicAPI();
    };

    return jutest;
  }
}