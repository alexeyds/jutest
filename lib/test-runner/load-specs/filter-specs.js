export async function filterSpecs(jutest, runnerContext) {
  let { specsByFile } = jutest;

  if (runnerContext.hasNoLineNumberLocations) {
    return specsByFile;
  }

  let result = {};

  for (let file in specsByFile) {
    result[file] = await recursivelyFindRunnableSpecs(specsByFile[file], runnerContext);
  }

  return result;
}

async function recursivelyFindRunnableSpecs(specs, runnerContext) {
  let result = [];

  for (let spec of specs) {
    let { sourceFilePath, lineNumbers } = spec.sourceLocator;

    if (runnerContext.isLocationRunnable(sourceFilePath, lineNumbers)) {
      result.push(spec);
    } else if (spec.isASuite) {
      let originalSpecs = await spec.composeSpecs();
      let nestedSpecs = await recursivelyFindRunnableSpecs(originalSpecs, runnerContext);

      if (originalSpecs.length === nestedSpecs.length) {
        result.push(spec);
      } else {
        result.push(...nestedSpecs);
      }
    }
  }

  return result;
}
