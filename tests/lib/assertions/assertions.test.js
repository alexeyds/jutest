import jutest from "jutest";
import { createAssertions, AssertionFailedError } from "assertions";

jutest("assertions", s => {
  s.describe("createAssertions()", s => {
    s.setup(() => {
      return { assertions: createAssertions() };
    });

    s.test("builds an object with assertions", (t, { assertions }) => {
      t.assert(assertions.match);
      t.assert(assertions.doesNotMatch);
      t.assert(assertions.same);
      t.assert(assertions.notSame);
      t.assert(assertions.fail);
      t.assert(assertions.equal);
      t.assert(assertions.notEqual);
      t.assert(assertions.assert);
      t.assert(assertions.refute);
      t.assert(assertions.throws);
    });

    s.test("throws an error if matcher failed", (t, { assertions }) => {
      let runAssertion = () => assertions.equal(1, 2);

      t.throws(runAssertion, AssertionFailedError);
      t.throws(runAssertion, /equal/);
    });

    s.test("does nothing if matcher passed", (t, { assertions }) => {
      assertions.equal(1, 1);
    });
  });
});
