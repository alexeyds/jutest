import { jutest } from "jutest";
import { spy } from "sinon";
import { loadFiles } from "runtime/utils";
import { Runtime } from "runtime";

function createFileRuntime(fileLocation) {
  return new Runtime({ fileLocations: [fileLocation] });
}

jutest("loadFiles", s => {
  s.setup(() => {
    let requireSpy = spy();
    let runtime = createFileRuntime({ file: 'foo.test.js' });

    return { requireSpy, runtime };
  });

  s.test("calls the require func with specified files", async (t, { requireSpy }) => {
    let file = 'foobar.test.js';
    let runtime = createFileRuntime({ file });
    await loadFiles(runtime.context, requireSpy);

    t.assert(requireSpy.called);
    t.equal(requireSpy.firstCall.args[0], file);
  });

  s.test("sets source path for loaded specs", async (t, { runtime }) => {
    let { jutest, specsContainer, context } = runtime;

    let requireFunc = () => {
      jutest.test('foo', () => {});
    };

    await loadFiles(context, requireFunc);
    let [test] = specsContainer.specs;

    t.assert(test.sourceLocator.sourceFilePath);
  });

  s.test("composes loaded specs", async (t, { runtime }) => {
    let { jutest, specsContainer, context } = runtime;

    let requireFunc = () => {
      jutest.describe('foo', () => {});
    };

    await loadFiles(context, requireFunc);
    let [suite] = specsContainer.specs;

    t.assert(suite.isComposed);
  });

  s.test("locks specs container after files are loaded", async (t, { runtime, requireSpy }) => {
    let { context, jutest } = runtime;
    await loadFiles(context, requireSpy);

    t.throws(() => jutest.test('asd'), /lock/);
  });
});
