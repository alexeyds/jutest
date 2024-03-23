import { jutest } from "jutest";
import { Jutest } from "core";
import { TestRunnerContext } from "test-runner/context";
import { loadSpecs } from "test-runner/load-specs";

jutest("loadSpecs", s => {
  s.setup(() => {
    let jutestInstance = new Jutest();
    return { jutestInstance };
  });

  s.test("requires and filters specs", async (t, { jutestInstance }) => {
    let { specsContainer } = jutestInstance;

    let requireFunc = async (file) => {
      await specsContainer.withSourceFilePath(file, () => {
        specsContainer.test('my test', () => {});
      });
    };

    let file = 'foobar.test.js';
    let context = TestRunnerContext.forSingleFile(file, { requireFunc });
    let result = await loadSpecs(jutestInstance, context);

    t.equal(result[file].length, 1);
    t.equal(result[file][0].name, 'my test');
  });

  s.test("sets total tests count in summary", async (t, { jutestInstance }) => {
    let { specsContainer } = jutestInstance;

    let requireFunc = async () => {
      await specsContainer.withSourceFilePath('foobar.test.js', () => {
        specsContainer.test('my test1');
        specsContainer.describe('my suite', (s) => {
          s.test('my test2');
          s.test('my test3');
        });
      });
    };
    let context = TestRunnerContext.forSingleFile('foobar.test.js', { requireFunc });
    await loadSpecs(jutestInstance, context);

    t.equal(context.runSummary.totalTestsCount, 3);
  });
});
