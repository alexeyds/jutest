import { TestContext } from "core/test-context";

export class Jutest {
  constructor({ specsContainer, context=new TestContext() }) {
    this.specsContainer = specsContainer;
    this.context = context;
  }

  toPublicAPI() {
    let { specsContainer, context } = this;

    let jutest = (...args) => {
      specsContainer.addSuite(...args, { context })
    };

    jutest.test = (...args) => {
      specsContainer.addTest(...args, { context })
    };

    jutest.describe = jutest;

    jutest.configureNewInstance = (configure) => {
      let newContext = context.copy();;
      let newInstance = new Jutest({
        specsContainer,
        context: newContext,
      })

      configure && configure(newContext.toConfigurationAPI());
      newContext.lock();

      return newInstance.toPublicAPI();
    };

    return jutest;
  }
}
