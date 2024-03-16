import { jutest } from "jutest";
import { Jutest } from "core";
import { TestRunnerContext } from "test-runner/context";
import { filterSpecs } from "test-runner/load-specs/filter-specs";

let ownFileName = 'filter-specs.test.js';

jutest("findRunnableSpecs", s => {
  s.setup(() => {
    let jutestInstance = new Jutest();
    let context = TestRunnerContext.forSingleLocation('foo.test.js');

    return { jutestInstance, context };
  });

  s.test("returns all specs by default", async (t, { jutestInstance, context }) => {
    jutestInstance.api.test('test1');
    jutestInstance.api.test('test2');

    let specs = await filterSpecs(jutestInstance, context);

    t.equal(specs.length, 2);
    t.equal(specs[0].name, 'test1');
    t.equal(specs[1].name, 'test2');
  });

  s.test("returns tests defined on the specified line", async (t, { jutestInstance }) => {
    let context = TestRunnerContext.forSingleLocation(ownFileName, 32);

    jutestInstance.specsContainer.sourceFilePath = ownFileName;
    jutestInstance.api.test('test1');
    jutestInstance.api.test('test2');

    let specs = await filterSpecs(jutestInstance, context);

    t.equal(specs.length, 1);
    t.equal(specs[0].name, 'test2');
  });

  s.test("works with suites", async (t, { jutestInstance }) => {
    let context = TestRunnerContext.forSingleLocation(ownFileName, 46);

    jutestInstance.specsContainer.sourceFilePath = ownFileName;
    jutestInstance.api.describe('test', s => {
      s.test('test1');
      s.test('test2');
    });

    let specs = await filterSpecs(jutestInstance, context);

    t.equal(specs.length, 1);
    t.equal(specs[0].name, 'test test2');
  });
});
