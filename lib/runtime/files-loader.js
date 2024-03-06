export class FilesLoader {
  constructor(runtimeContext) {
    this.runtimeContext = runtimeContext;
  }

  async loadFiles(fileList) {
    for (let filePath of fileList) {
      this.specsContainer.setCurrentSourceFilePath(filePath);
      require(filePath);

      for (let spec of this.specsContainer.specs) {
        if (spec.isASuite) {
          await spec.composeSpecs();
        }
      }
    }
  }

  get specsContainer() {
    return this.runtimeContext.specsContainer;
  }
}
