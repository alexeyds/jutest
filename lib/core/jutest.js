import { TestContext } from "core/test-context";

export class Jutest {
  constructor({ testsContainer, context=new TestContext() }) {
    this.testsContainer = testsContainer;
    this.context = context;
  }

  toPublicAPI() {
    let { testsContainer, context } = this;

    let jutest = (...args) => {
      testsContainer.addSuite(...args, { context })
    };

    jutest.test = (...args) => {
      testsContainer.addTest(...args, { context })
    };

    jutest.describe = jutest;

    jutest.configureNewInstance = (configure) => {
      let newContext = context.copy();;
      let newInstance = new Jutest({
        testsContainer,
        context: newContext,
      })

      configure && configure(newContext.toConfigurationAPI());
      newContext.lock();

      return newInstance.toPublicAPI();
    };

    return jutest;
  }
}
