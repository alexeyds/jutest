import jutest from "jutest";
import { AsyncJob } from "utils/async-job";

jutest("utils/async-job", s => {
  s.describe("AsyncJob", s => {
    s.test("has initial attributes", t => {
      let job = new AsyncJob(() => 1);

      t.equal(job.wasRun, false);
      t.equal(job.result, undefined);
    });

    s.test("executes given function", async t => {
      let job = new AsyncJob(() => 1);

      let promise = job.run();
      t.equal(job.wasRun, false);

      let result = await promise;
      t.equal(result, 1);
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
