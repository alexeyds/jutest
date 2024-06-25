export async function filterSpecs(jutest, runnerContext) {
  let { specsByFile } = jutest;

  if (runnerContext.hasNoLocationFilters && runnerContext.hasNoTagFilters) {
    return specsByFile;
  }

  let result = {};

  for (let file in specsByFile) {
    let specs = await recursivelyFindRunnableSpecs(specsByFile[file], runnerContext);

    if (specs.length) {
      result[file] = specs;
    }
  }

  return result;
}

async function recursivelyFindRunnableSpecs(specs, runnerContext) {
  let result = [];

  for (let spec of specs) {
    if (isLocationRunnableOptimized(spec, runnerContext) && areTagsRunnable(spec, runnerContext)) {
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

function isLocationRunnableOptimized(spec, runnerContext) {
  if (runnerContext.hasNoLocationFilters) {
    return true;
  }  else {
    // Detecting a line number is expensive because it acquires an error stack
    let { sourceFilePath, lineNumbers } = spec.sourceLocator;

    return runnerContext.isLocationRunnable(sourceFilePath, lineNumbers);
  }
}

function areTagsRunnable(spec, runnerContext) {
  let isRunnable = runnerContext.areTagsRunnable(spec.tags);

  if (isRunnable && runnerContext.hasExcludeTagFilters && runnerContext.hasNoOnlyIncludeTagFilters && spec.isASuite) {
    isRunnable = false;
  }
  
  return isRunnable;
}
