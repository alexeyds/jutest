export async function findRunnableSpecs(runtimeContext) {
  let { specsContainer, config } = runtimeContext;
  return await recursivelyFindRunnableSpecs(specsContainer.specs, config);
}

async function recursivelyFindRunnableSpecs(specs, config) {
  let result = [];

  for (let spec of specs) {
    let { sourceFilePath, lineNumber } = spec.sourceLocator;

    if (config.isLocationRunnable(sourceFilePath, lineNumber)) {
      result.push(spec);
    } else if (spec.isASuite) {
      let nestedSpecs = await recursivelyFindRunnableSpecs(await spec.composeSpecs(), config);
      result.push(...nestedSpecs);
    }
  }

  return result;
}
