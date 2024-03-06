import { jutest } from "jutest";
import { runtime } from "./fixtures/runtime-instance";

let { specsContainer, filesLoader } = runtime;

jutest("FilesLoader", s => {
  s.setup(async () => {
    await filesLoader.loadFiles([`${__dirname}/fixtures/file-with-tests.js`]);
  });

  s.describe("#loadFiles", s => {
    s.test("requires provided files", t => {
      t.equal(specsContainer.specs.length, 2);
    });

    s.test("composes loaded specs", t => {
      let [suite1] = specsContainer.specs;
      t.assert(suite1.isComposed);
    });

    s.test("sets location to loaded tests", async t => {
      let [suite1] = specsContainer.specs;
      let [suite2] = await suite1.composeSpecs();
      let [test1] = await suite2.composeSpecs();

      t.assert(suite1.sourceLocator.sourceFilePath);
      t.equal(suite1.sourceLocator.lineNumber, 4);
      t.equal(test1.sourceLocator.lineNumber, 6);
    });
  });
});
