import { jutest } from "jutest";
import { Jutest } from "core";
import { TestRunnerContext } from "test-runner/context";
import { loadSpecs } from "test-runner/load-specs";

jutest("loadFiles", s => {
  s.setup(() => {
    let jutestInstance = new Jutest();
    return { jutestInstance };
  });

  s.test("requires and filters specs", async (t, { jutestInstance }) => {
    let requireFunc = (file) => {
      jutestInstance.specsContainer.sourceFilePath = file;
      jutestInstance.specsContainer.test('my test', () => {})
    }

    let file = 'foobar.test.js';
    let context = TestRunnerContext.forSingleLocation(file);
    let result = await loadSpecs(jutestInstance, context, requireFunc);

    t.equal(result[file].length, 1);
    t.equal(result[file][0].name, 'my test');
  });

  s.test("sets total tests count in summary", async (t, { jutestInstance }) => {
    let requireFunc = () => {
      jutestInstance.specsContainer.test('my test1');
      jutestInstance.specsContainer.describe('my suite', (s) => {
        s.test('my test2');
        s.test('my test3')
      })
    }
    let context = TestRunnerContext.forSingleLocation('foobar.test.js');
    await loadSpecs(jutestInstance, context, requireFunc);

    t.equal(context.runSummary.totalTestsCount, 3);
  });
});
