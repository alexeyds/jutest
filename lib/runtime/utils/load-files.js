export async function loadFiles(runtimeContext, requireFunc=require) {
  let { config, specsContainer } = runtimeContext;
  let { fileLocations } = config;

  let files = fileLocations.map(l => l.file);

  for (let filePath of files) {
    await specsContainer.withSourceFilePath(filePath, async () => {
      requireFunc(filePath);

      for (let spec of specsContainer.specs) {
        if (spec.isASuite) {
          await spec.composeSpecs();
        }
      }
    });
  }

  specsContainer.lock(
    `Jutest is locked and doesn't accept new specs. `+
    `Make sure that all your specs are registered during the initial file load, ` +
    `asynchronous/delayed spec registration is not supported.`
  );
}
