export async function filterSpecs(jutest, runnerContext) {
  let { specsByFile } = jutest;
  let result = {};

  for (let file in specsByFile) {
    result[file] = await recursivelyFindRunnableSpecs(specsByFile[file], runnerContext);
  }

  return result;
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
