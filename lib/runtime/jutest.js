import { TestContext } from "core";

export class Jutest {
  constructor(runtimeContext, testContext=new TestContext()) {
    this.runtimeContext = runtimeContext;
    this.testContext = testContext;
  }

  toPublicAPI() {
    let { runtimeContext, testContext } = this;

    let builderAPI = runtimeContext.specsContainer.toBuilderAPI({ context: testContext });
    let jutest = builderAPI.describe;
    Object.assign(jutest, builderAPI);

    jutest.configureNewInstance = (configure) => {
      let newTestContext = testContext.copy();
      let newInstance = new Jutest(runtimeContext, newTestContext);

      configure && configure(newTestContext.toConfigurationAPI());
      newTestContext.lock("Jutest instances can only be configured inside the configureNewInstance's body, async/delayed configuration is not supported.");

      return newInstance.toPublicAPI();
    };

    return jutest;
  }
}
