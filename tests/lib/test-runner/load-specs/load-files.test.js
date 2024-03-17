import { jutest } from "jutest";
import { spy } from "sinon";
import { Jutest } from "core";
import { TestRunnerContext } from "test-runner/context";
import { loadFiles } from "test-runner/load-specs/load-files";

jutest("loadFiles", s => {
  s.setup(() => {
    let requireSpy = spy();
    let jutestInstance = new Jutest();
    let file = 'foo.test.js';
    let context = TestRunnerContext.forSingleLocation(file);

    return { requireSpy, context, jutestInstance, file };
  });

  s.test("calls the require func with specified files", async (t, { requireSpy, jutestInstance }) => {
    let file = 'foobar.test.js';
    let context = TestRunnerContext.forSingleLocation(file);
    await loadFiles(jutestInstance, context, requireSpy);

    t.assert(requireSpy.called);
    t.equal(requireSpy.firstCall.args[0], file);
  });

  s.test("sets source path for loaded specs", async (t, { context, jutestInstance, file }) => {
    let requireFunc = () => {
      jutestInstance.api.test('foo', () => {});
    };

    await loadFiles(jutestInstance, context, requireFunc);
    let [test] = jutestInstance.specs;

    t.assert(test.sourceLocator.sourceFilePath);
    t.same(jutestInstance.specsByFile[file], [test]);
  });

  s.test("composes loaded specs", async (t, { context, jutestInstance }) => {
    let requireFunc = () => {
      jutestInstance.api.describe('foo', () => {});
    };

    await loadFiles(jutestInstance, context, requireFunc);
    let [suite] = jutestInstance.specs;

    t.assert(suite.isComposed);
  });

  s.test("locks specs container after files are loaded", async (t, { context, jutestInstance, requireSpy }) => {
    await loadFiles(jutestInstance, context, requireSpy);

    t.throws(() => jutestInstance.api.test('asd'), /lock/);
  });
});
