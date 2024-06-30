import { loadFiles } from "./load-files";
import { filterSpecs } from "./filter-specs";

export async function loadSpecs(jutest, runnerContext, requireFunc) {
  await loadFiles(jutest, runnerContext, requireFunc);
  let specsByFile = await filterSpecs(jutest, runnerContext);

  runnerContext.runSummary.setTotalTestsCount(countTests(specsByFile));

  return specsByFile;
}

function countTests(specsByFile) {
  let count = 0;

  for (let file in specsByFile) {
    for (let spec of specsByFile[file]) {
      if (spec.isASuite) {
        count += spec.testsCount;
      } else {
        count += 1;
      }
    }
  }

  return count;
}
