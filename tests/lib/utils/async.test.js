import { jutest } from "jutest";
import { createOrderedResolver, AsyncJob } from "utils/async";

jutest("utils/async", s => {
  s.describe("createOrderedResolver", s => {
    s.test("resolves provided functions in order", async t => {
      let results = [];
      let slowFunc = async () => {
        await Promise.resolve();
        results.push('slow function');
      };
      let fastfunc = () => results.push('fast function');

      let resolver = createOrderedResolver([slowFunc, fastfunc]);
      await resolver();

      t.same(results, ['slow function', 'fast function']);
    });

    s.test("passes all arguments from resolver to the functions", async t => {
      let result;
      let func = (arg) => result = arg;

      let resolver = createOrderedResolver([func]);
      await resolver('test');

      t.equal(result, 'test');
    });
  });

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
