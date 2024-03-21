import { jutest } from "jutest";
import path from "path";
import { spy } from "sinon";
import { fileLocation } from "utils/file-location";
import { TestRunnerEnums } from "test-runner";
import { jutestInstance } from "./fixtures/jutest-instance";
import { TestRunner } from "test-runner";

let { Events, ExitReasons } = TestRunnerEnums;

let fixtureFilePath = path.join(process.cwd(), 'tests/lib/test-runner/fixtures/test-fixtures.js');

function createFixtureRunner({ lineNumbers }={}) {
  return new TestRunner({
    fileLocations: [ fileLocation(fixtureFilePath, lineNumbers) ]
  });
}

jutest("TestRunner", s => {
  s.setup(() => {
    return { runner: createFixtureRunner() };
  });

  s.describe("run", s => {
    s.test("loads files and runs defined tests", async (t, { runner }) => {
      let listener = spy();
      runner.eventEmitter.on(Events.TestStart, listener);
      let result = await runner.run(jutestInstance);

      t.equal(listener.callCount, 3);
      t.equal(result.totalTestsCount, 5);
      t.equal(result.runTestsCount, 5);
      t.equal(result.skippedTestsCount, 2);
      t.equal(result.failedTestsCount, 1);
      t.equal(result.testSummaries[0].name, 'main suite test 1');
    });

    s.test("sets run-end exit reason", async (t, { runner }) => {
      let result = await runner.run(jutestInstance);
      t.assert(result.exitReason, ExitReasons.RunEnd);
    });

    s.test("sets runTime in summary", async (t, { runner }) => {
      let result = await runner.run(jutestInstance);
      t.assert(result.runTime);
    });

    s.test("supports running specs defined on the specific lines", async t => {
      let runner = createFixtureRunner({ lineNumbers: [14, 18] });
      let { totalTestsCount, testSummaries } = await runner.run(jutestInstance);

      t.equal(totalTestsCount, 2);
      t.equal(testSummaries[0].name, 'main suite skipped suite test 4');
      t.equal(testSummaries[1].name, 'standalone test');
    });
  });
});
