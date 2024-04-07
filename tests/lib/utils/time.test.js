import { jutest } from "jutest";
import { spy } from "sinon";
import { measureTimeElapsed, presentMilliseconds } from "utils/time";

jutest("utils/time", s => {
  s.describe("measureTimeElapsed", s => {
    s.test("executes provided function", async t => {
      let func = spy();
      await measureTimeElapsed(func);

      t.equal(func.called, true);
    });

    s.test("returns time elapsed", async t => {
      let { time } = await measureTimeElapsed(() => {});
      t.assert(time);
    });

    s.test("includes returnValue of the original function", async t => {
      let { returnValue } = await measureTimeElapsed(() => 1);
      t.equal(returnValue, 1);
    });
  });

  s.describe("presentMilliseconds", s => {
    s.test("converts ms to seconds", t => {
      t.equal(presentMilliseconds(79142), '79.14s');
    });
  });
});
