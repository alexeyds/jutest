import { measureTimeElapsed } from "utils/time";

export async function loadFiles(jutest, runnerContext) {
  let { specsContainer } = jutest;

  let files = runnerContext.fileLocations.map(l => l.file);

  for (let filePath of files) {
    await specsContainer.withSourceFilePath(filePath, async () => {
      let { time: loadTime } = await measureTimeElapsed(() => requireTestFile(filePath, runnerContext));
      runnerContext.runSummary.setFileLoadTime(filePath, loadTime);

      for (let spec of specsContainer.specs) {
        if (spec.isASuite) {
          await spec.composeSpecs();
        }
      }
    });
  }

  specsContainer.lockContainer(
    `Jutest is locked and doesn't accept new specs. `+
    `Make sure that all your specs are registered during the initial file load, ` +
    `asynchronous/delayed spec registration is not supported.`
  );
}

function requireTestFile(filePath, runnerContext) {
  let { requireFunc } = runnerContext;
  return requireFunc ? requireFunc(filePath) : import(filePath);
}
