import { jutest } from "jutest";
import { spy } from "sinon";
import { Jutest } from "core";
import { TestRunnerContext } from "test-runner/context";
import { loadFiles } from "test-runner/load-specs/load-files";

jutest("loadFiles", s => {
  s.setup(() => {
    let requireFunc = spy();
    let jutestInstance = new Jutest();
    let file = 'foo.test.js';
    let context = TestRunnerContext.forSingleFile(file, { requireFunc });

    return { requireFunc, context, jutestInstance, file };
  });

  s.test("calls the require func with specified files", async (t, { requireFunc, jutestInstance }) => {
    let file = 'foobar.test.js';
    let context = TestRunnerContext.forSingleFile(file, { requireFunc });
    await loadFiles(jutestInstance, context);

    t.assert(requireFunc.called);
    t.equal(requireFunc.firstCall.args[0], file);
  });

  s.test("sets source path for loaded specs", async (t, { jutestInstance, file }) => {
    let requireFunc = () => {
      jutestInstance.api.test('foo', () => {});
    };
    let context = TestRunnerContext.forSingleFile(file, { requireFunc });

    await loadFiles(jutestInstance, context, requireFunc);
    let [test] = jutestInstance.specs;

    t.assert(test.sourceLocator.sourceFilePath);
    t.same(jutestInstance.specsByFile[file], [test]);
  });

  s.test("composes loaded specs", async (t, { file, jutestInstance }) => {
    let requireFunc = () => {
      jutestInstance.api.describe('foo', () => {});
    };

    let context = TestRunnerContext.forSingleFile(file, { requireFunc });
    await loadFiles(jutestInstance, context, requireFunc);
    let [suite] = jutestInstance.specs;

    t.assert(suite.isComposed);
  });

  s.test("locks specs container after files are loaded", async (t, { context, jutestInstance }) => {
    await loadFiles(jutestInstance, context);

    t.throws(() => jutestInstance.api.test('asd'), /lock/);
  });

  s.test("sets load times for files in summary", async (t, { jutestInstance, context }) => {
    await loadFiles(jutestInstance, context);
    let { fileLoadTimes } = context.runSummary;

    t.equal(fileLoadTimes.length, 1);
    t.assert(fileLoadTimes[0].loadTime);
  });
});
