export class Jutest {
  constructor(runtimeContext) {
    this.runtimeContext = runtimeContext;
  }

  toPublicAPI() {
    let { runtimeContext } = this;
    let { specsContainer } = runtimeContext;

    let builderAPI = specsContainer.toBuilderAPI();
    let jutest = builderAPI.describe;
    Object.assign(jutest, builderAPI);

    jutest.configureNewInstance = (configure) => {
      let newSpecsContainer = specsContainer.copyWithSharedSpecs();
      let newRuntimeContext = { ...runtimeContext, specsContainer: newSpecsContainer };
      let newInstance = new Jutest(newRuntimeContext);

      configure && configure(newSpecsContainer.toContextAPI());
      newSpecsContainer.lockContext("Jutest instances can only be configured inside the configureNewInstance's body, async/delayed configuration is not supported.");

      return newInstance.toPublicAPI();
    };

    return jutest;
  }
}
