export async function filterSpecs(jutest, runnerContext) {
  return await recursivelyFindRunnableSpecs(jutest.specs, runnerContext);
}

async function recursivelyFindRunnableSpecs(specs, runnerContext) {
  let result = [];

  for (let spec of specs) {
    let { sourceFilePath, lineNumber } = spec.sourceLocator;

    if (runnerContext.isLocationRunnable(sourceFilePath, lineNumber)) {
      result.push(spec);
    } else if (spec.isASuite) {
      let nestedSpecs = await recursivelyFindRunnableSpecs(await spec.composeSpecs(), runnerContext);
      result.push(...nestedSpecs);
    }
  }

  return result;
}
