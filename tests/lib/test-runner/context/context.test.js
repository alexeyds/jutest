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

  s.describe("hasNoLineNumberLocations", s => {
    s.test("returns true there are no locations with line number", t => {
      let context = TestRunnerContext.forSingleLocation('foo.test');
      t.equal(context.hasNoLineNumberLocations, true);
    });

    s.test("returns false there are some locations with line number", t => {
      let context = TestRunnerContext.forSingleLocation('foo.test', [15]);
      t.equal(context.hasNoLineNumberLocations, false);
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
