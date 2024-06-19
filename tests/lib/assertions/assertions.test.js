import { jutest } from "jutest";
import { JutestAssertions, AssertionFailedError } from "assertions";

jutest("assertions", s => {
  s.describe("JutestAssertions", s => {
    s.setup(() => {
      return { assertions: new JutestAssertions() };
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
      t.assert(assertions.includes);
      t.assert(assertions.excludes);

      t.assert(assertions.async.passesEventually);
      t.assert(assertions.async.rejects);
    });

    s.test("throws an error if matcher failed", (t, { assertions }) => {
      let runAssertion = () => assertions.equal(1, 2);

      t.throws(runAssertion, AssertionFailedError);
      t.throws(runAssertion, /equal/);
    });

    s.test("does nothing if matcher passed", (t, { assertions }) => {
      assertions.equal(1, 1);
    });

    s.test("waits on async assertions", async (t, { assertions }) => {
      let runAssertion = async () => assertions.async.rejects(Promise.reject(new Error('test')), /foo/);

      let error = await runAssertion().catch(e => e);

      t.match(error, /test/);
      t.match(error, /rejects/);
    });
  });
});
