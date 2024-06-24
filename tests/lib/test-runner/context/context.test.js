import { jutest } from "jutest";
import { fileLocation } from "utils/file-location";
import { TestRunnerContext } from "test-runner/context";

jutest("TestRunnerContext", s => {
  s.describe("constructor", s => {
    s.test("assigns defaults", t => {
      let context = new TestRunnerContext();

      t.same(context.fileLocations, []);
      t.assert(context.eventEmitter);
      t.assert(context.runSummary);
      t.equal(context.randomizeOrder, false);
      t.equal(context.seed, undefined);
      t.same(context.onlyIncludeTags, {});
      t.same(context.excludeTags, {});
    });

    s.test("accepts fileLocations param", t => {
      let fileLocations = [fileLocation('test.js', [13])];
      let context = new TestRunnerContext({ fileLocations });

      t.same(context.fileLocations, fileLocations);
    });

    s.test("accepts order params", t => {
      let context = new TestRunnerContext({ randomizeOrder: true, seed: 123 });

      t.equal(context.randomizeOrder, true);
      t.equal(context.seed, 123);
    });

    s.test("accepts tags", t => {
      let context = new TestRunnerContext({ onlyIncludeTags: { a: 1 }, excludeTags: { b: 2 } });

      t.same(context.onlyIncludeTags, { a: 1 });
      t.same(context.excludeTags, { b: 2 });
    });
  });

  s.describe("::forSingleLocation", s => {
    s.test("returns context with file and line numbers", t => {
      let context = TestRunnerContext.forSingleLocation('test.js', [15]);
      t.same(context.fileLocations, [fileLocation('test.js', [15])]);
    });
  });

  s.describe("::forSingleFile", s => {
    s.test("returns context with file", t => {
      let context = TestRunnerContext.forSingleFile('test.js');
      t.same(context.fileLocations, [fileLocation('test.js')]);
    });

    s.test("accepts extra config", t => {
      let requireFunc = () => {};
      let context = TestRunnerContext.forSingleFile('test.js', { requireFunc });

      t.equal(context.requireFunc, requireFunc);
    });
  });

  s.describe("hasNoTagFilters", s => {
    s.test("returns true if context has no tag filters", t => {
      let context = new TestRunnerContext({});
      t.equal(context.hasNoTagFilters, true);
    });

    s.test("returns false if context has inclusion filters", t => {
      let context = new TestRunnerContext({ onlyIncludeTags: { a: 1 } });
      t.equal(context.hasNoTagFilters, false);
    });

    s.test("returns false if context has exclusion filters", t => {
      let context = new TestRunnerContext({ excludeTags: { a: 1 } });
      t.equal(context.hasNoTagFilters, false);
    });
  });

  s.describe("areTagsRunnable", s => {
    s.test("returns true if there are no tag filters", t => {
      let context = new TestRunnerContext();
      t.equal(context.areTagsRunnable({}), true);
    });

    s.test("returns false if tags dont match the include filter", t => {
      let context = new TestRunnerContext({ onlyIncludeTags: { a: 1 } });
      t.equal(context.areTagsRunnable({}), false);
    });

    s.test("returns true if one of the tags matches the include filter", t => {
      let context = new TestRunnerContext({ onlyIncludeTags: { a: 1, b: 2 } });
      t.equal(context.areTagsRunnable({ b: 2 }), true);
    });

    s.test("returns true if tags dont match exclusion filter", t => {
      let context = new TestRunnerContext({ excludeTags: { a: 1, b: 2 } });
      t.equal(context.areTagsRunnable({}), true);
    });

    s.test("returns false if some tags match exclusion filter", t => {
      let context = new TestRunnerContext({ excludeTags: { a: 1, b: 2 } });
      t.equal(context.areTagsRunnable({ a: 1 }), false);
    });

    s.test("prefers inclusion over exclusion", t => {
      let context = new TestRunnerContext({ onlyIncludeTags: { a: 1 }, excludeTags: { a: 1, b: 2 } });
      t.equal(context.areTagsRunnable({ a: 1 }), true);
    });
  });

  s.describe("hasNoLocationFilters", s => {
    s.test("returns true there are no locations with line number", t => {
      let context = TestRunnerContext.forSingleLocation('foo.test');
      t.equal(context.hasNoLocationFilters, true);
    });

    s.test("returns false there are some locations with line number", t => {
      let context = TestRunnerContext.forSingleLocation('foo.test', [15]);
      t.equal(context.hasNoLocationFilters, false);
    });
  });

  s.describe("isLocationRunnable", s => {
    s.test("returns true for any location if locations list is empty", t => {
      let context = new TestRunnerContext();

      t.equal(context.isLocationRunnable('foo.test', [14]), true);
      t.equal(context.isLocationRunnable('bar.test'), true);
      t.equal(context.isLocationRunnable(null), true);
    });

    s.test("returns true if location doesn't match the file", t => {
      let context = TestRunnerContext.forSingleLocation('foo.test', [14]);
      t.equal(context.isLocationRunnable('bar.test', [14]), true);
    });

    s.test("returns false if location doesn't match the line number", t => {
      let context = TestRunnerContext.forSingleLocation('foo.test', [14]);
      t.equal(context.isLocationRunnable('foo.test', [21]), false);
    });

    s.test("returns false if line number is missing", t => {
      let context = TestRunnerContext.forSingleLocation('foo.test', [14]);
      t.equal(context.isLocationRunnable('foo.test'), false);
    });

    s.test("returns true if location matches the line number", t => {
      let context = TestRunnerContext.forSingleLocation('foo.test', [14]);
      t.equal(context.isLocationRunnable('foo.test', [14]), true);
    });

    s.test("returns true for any location within the file if lineNumber is not specified", t => {
      let context = TestRunnerContext.forSingleLocation('foo.test');
      t.equal(context.isLocationRunnable('foo.test', [14]), true);
    });

    s.test("supports locations with multiple lines", t => {
      let context = TestRunnerContext.forSingleLocation('foo.test', [13, 15]);

      t.equal(context.isLocationRunnable('foo.test', [13]), true);
      t.equal(context.isLocationRunnable('foo.test', [15]), true);
      t.equal(context.isLocationRunnable('foo.test', [17]), false);
      t.equal(context.isLocationRunnable('bar.test'), true);
    });

    s.test("works with multiple line numbers", t => {
      let context = TestRunnerContext.forSingleLocation('foo.test', [14]);
      t.equal(context.isLocationRunnable('foo.test', [14, 15]), true);
    });
  });
});
