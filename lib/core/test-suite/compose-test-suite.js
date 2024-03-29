export async function composeTestSuite(suiteBody, specsContainer) {
  if (typeof suiteBody === 'function') {
    await suiteBody(specsContainer.toSuiteAPI());
  }

  lock(specsContainer);

  let testsCount = 0;

  for (let spec of specsContainer.specs) {
    if (spec.isASuite) {
      await spec.composeSpecs();
      testsCount += spec.testsCount;
    } else {
      testsCount += 1;
    }
  }

  return { specs: specsContainer.specs, testsCount };
}

function lock(specsContainer) {
  let { context } = specsContainer;

  specsContainer.lockContext(
    `Test context for "${context.name}" suite is locked and cannot be modified. `+
    `Make sure that you only add setups, teardowns, etc. inside the test suite's body.`
  );

  specsContainer.lockContainer(
    `Test suite "${context.name}" is locked and doesn't accept new specs. `+
    `Make sure that your specs are only registered from within the given test suite's body.`
  );
}
