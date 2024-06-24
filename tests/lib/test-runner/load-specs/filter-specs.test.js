import { jutest } from "jutest";
import { Jutest } from "core";
import { TestRunnerContext } from "test-runner/context";
import { filterSpecs } from "test-runner/load-specs/filter-specs";

let ownFileName = 'filter-specs.test.js';

jutest("filterSpecs", s => {
  s.setup(() => {
    let jutestInstance = new Jutest();
    return { jutestInstance };
  });

  s.test("returns all specs by default", async (t, { jutestInstance }) => {
    jutestInstance.api.test('test1');
    jutestInstance.api.test('test2');

    let context = new TestRunnerContext();
    let specsByFile = await filterSpecs(jutestInstance, context);
    let specs = specsByFile['null'];

    t.equal(specs.length, 2);
    t.equal(specs[0].name, 'test1');
    t.equal(specs[1].name, 'test2');
  });

  s.test("returns tests defined on the specified line", async (t, { jutestInstance }) => {
    await jutestInstance.specsContainer.withSourceFilePath(ownFileName, () => {
      jutestInstance.api.test('test1');
      jutestInstance.api.test('test2');
    });

    let context = TestRunnerContext.forSingleLocation(ownFileName, [30]);
    let specsByFile = await filterSpecs(jutestInstance, context);
    let specs = specsByFile[ownFileName];

    t.equal(specs.length, 1);
    t.equal(specs[0].name, 'test2');
  });

  s.test("works with suites", async (t, { jutestInstance }) => {
    await jutestInstance.specsContainer.withSourceFilePath(ownFileName, () => {
      jutestInstance.api.describe('test', s => {
        s.test('test1');
        s.test('test2');
      });
    });

    let context = TestRunnerContext.forSingleLocation(ownFileName, [45]);
    let specsByFile = await filterSpecs(jutestInstance, context);
    let specs = specsByFile[ownFileName];

    t.equal(specs.length, 1);
    t.equal(specs[0].name, 'test test2');
  });

  s.test("includes entire suite if all tests inside of it match the location", async (t, { jutestInstance }) => {
    await jutestInstance.specsContainer.withSourceFilePath(ownFileName, () => {
      jutestInstance.api.describe('test', s => {
        s.test('test1');
        s.test('test2');
      });
    });

    let context = TestRunnerContext.forSingleLocation(ownFileName, [60, 61]);
    let specsByFile = await filterSpecs(jutestInstance, context);
    let specs = specsByFile[ownFileName];

    t.equal(specs.length, 1);
    t.equal(specs[0].name, 'test');
  });
});
