import { jutest } from "jutest";
import { TestRunnerContext } from "test-runner/context";

jutest("TestRunnerContext", s => {
  s.describe("constructor", s => {
    s.test("assigns defaults", t => {
      let context = new TestRunnerContext();
      t.same(context.fileLocations, []);
      t.assert(context.eventEmitter);
    });

    s.test("accepts fileLocations param", t => {
      let fileLocations = [{file: 'test.js', lineNumber: 13}];
      let context = new TestRunnerContext({ fileLocations });

      t.same(context.fileLocations, fileLocations);
    });
  });

  s.describe("::forSingleLocation", s => {
    s.test("returns context with file", t => {
      let context = TestRunnerContext.forSingleLocation('test.js', 15);
      t.same(context.fileLocations, [{file: 'test.js', lineNumber: 15}]);
    });
  });

  s.describe("isLocationRunnable", s => {
    s.test("returns true for any location if locations list is empty", t => {
      let context = new TestRunnerContext();
      t.equal(context.isLocationRunnable('foo.test', 14), true);
    });

    s.test("returns false if location doesn't match line number", t => {
      let context = TestRunnerContext.forSingleLocation('foo.test', 14);
      t.equal(context.isLocationRunnable('foo.test', 13), false);
    });

    s.test("returns true if line number matches", t => {
      let context = TestRunnerContext.forSingleLocation('foo.test', 14);
      t.equal(context.isLocationRunnable('foo.test', 14), true);
    });

    s.test("returns true if file has no line number", t => {
      let context = TestRunnerContext.forSingleLocation('foo.test');
      t.equal(context.isLocationRunnable('foo.test', 13), true);
    });

    s.test("returns true for all other files", t => {
      let context = TestRunnerContext.forSingleLocation('foo.test', 13);
      t.equal(context.isLocationRunnable('bar.test', 15), true);
    });

    s.test("supports multiple locations within the same file", t => {
      let context = new TestRunnerContext({ 
        fileLocations: [
          { file: 'foo.test', lineNumber: 13 },
          { file: 'foo.test', lineNumber: 15 }
        ]
      });

      t.equal(context.isLocationRunnable('foo.test', 13), true);
      t.equal(context.isLocationRunnable('foo.test', 15), true);
    });
  });
});
