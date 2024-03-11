import { jutest } from "jutest";
import { Runtime } from "runtime";
import { findRunnableSpecs } from "runtime/utils";

let ownFileName = 'find-runnable-specs.test.js';

function createFileRuntime(fileLocation) {
  return new Runtime({ fileLocations: [fileLocation] });
}

jutest("findRunnableSpecs", s => {
  s.test("returns all specs by default", async t => {
    let { context, jutest } = new Runtime();
    jutest.test('test1');
    jutest.test('test2');

    let specs = await findRunnableSpecs(context);

    t.equal(specs.length, 2);
    t.equal(specs[0].name, 'test1');
    t.equal(specs[1].name, 'test2');
  });

  s.test("returns tests defined on the specified line", async t => {
    let { specsContainer, jutest, context } = createFileRuntime({ file: ownFileName, lineNumber: 29 });

    specsContainer.sourceFilePath = ownFileName;
    jutest.test('test1');
    jutest.test('test2');

    let specs = await findRunnableSpecs(context);

    t.equal(specs.length, 1);
    t.equal(specs[0].name, 'test2');
  });

  s.test("works with suites", async t => {
    let { specsContainer, jutest, context } = createFileRuntime({ file: ownFileName, lineNumber: 43 });

    specsContainer.sourceFilePath = ownFileName;
    jutest.describe('test', s => {
      s.test('test1');
      s.test('test2');
    });

    let specs = await findRunnableSpecs(context);

    t.equal(specs.length, 1);
    t.equal(specs[0].name, 'test test2');
  });0;
});
