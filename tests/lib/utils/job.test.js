import jutest from "jutest";
import { Job, AsyncJob } from "utils/job";

jutest("utils/job", s => {
  s.describe("Job", s => {
    s.test("has initial attributes", t => {
      let job = new Job(() => 1);

      t.equal(job.wasRun, false);
      t.equal(job.result, undefined);
    });

    s.test("executes given function", t => {
      let job = new Job(() => 1);
      let result = job.run();

      t.equal(result, 1);
      t.equal(job.wasRun, true);
      t.equal(job.result, 1);
    });

    s.test("returns same value on consequent executions", t => {
      let job = new Job(() => Math.random());
      let result1 = job.run();
      let result2 = job.run();

      t.equal(result1, result2);
      t.equal(job.result, result1);
    });
  });

  s.describe("AsyncJob", s => {
    s.test("behaves like job", async t => {
      let job = new AsyncJob(() => 1);
      await job.run();

      t.equal(job.wasRun, true);
      t.equal(job.result, 1);
    });

    s.test("always returns same promise", async t => {
      let job = new AsyncJob(() => Promise.resolve(Math.random()));

      let promise1 = job.run();
      let promise2 = job.run();
      let [result1, result2] = await Promise.all([promise1, promise2]);

      t.equal(result1, result2);
      t.assert(job.result);
      t.equal(job.result, result1);
    });
  });
});
