import { loadFiles } from "./load-files";
import { filterSpecs } from "./filter-specs";

export async function loadSpecs(jutest, runnerContext) {
  await loadFiles(jutest, runnerContext);
  return await filterSpecs(jutest, runnerContext);
}
