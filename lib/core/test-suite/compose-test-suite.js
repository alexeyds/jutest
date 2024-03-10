import { SpecsContainer } from "core/specs-container";

export async function composeTestSuite(suiteBody, { context, skip, sourceFilePath }) {
  let specsContainer = new SpecsContainer({ skip });
  specsContainer.setSourceFilePath(sourceFilePath);

  let suiteBuilder = {
    ...specsContainer.toBuilderAPI({ context }),
    ...context.toConfigurationAPI(),
  };

  if (typeof suiteBody === 'function') {
    await suiteBody(suiteBuilder);
  }

  lock(context, specsContainer);

  for (let spec of specsContainer.specs) {
    if (spec.isASuite) {
      await spec.composeSpecs();
    }
  }

  return specsContainer.specs;
}

function lock(context, specsContainer) {
  context.lock(
    `Test context for "${context.name}" suite is locked and cannot be modified. `+
    `Make sure that you only add setups, teardowns, etc. inside the test suite's body.`
  );

  specsContainer.lock(
    `Test suite "${context.name}" is locked and doesn't accept new specs. `+
    `Make sure that your specs are only registered from within the given test suite's body.`
  );
}
