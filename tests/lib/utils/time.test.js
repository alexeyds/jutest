import { jutest } from "jutest";
import { spy } from "sinon";
import { measureTimeElapsed } from "utils/time";

jutest("utils/time", s => {
  s.describe("measureTimeElapsed", s => {
    s.test("executes provided function", async t => {
      let func = spy();
      await measureTimeElapsed(func);

      t.equal(func.called, true);
    });

    s.test("returns time elapsed", async t => {
      let time = await measureTimeElapsed(() => {});
      t.assert(time);
    });
  });
});
