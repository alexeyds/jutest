import { jutest } from "jutest";
import { passesEventually } from "assertions/matchers/async/passes-eventually";

jutest("assertions/matchers/async/passes-eventually", s => {
  s.test("returns success if provided function stops raising errors", async t => {
    let calls = 0;
    let result = await passesEventually(() => {
      calls += 1;

      if (calls == 1) {
        throw new Error('foobar');
      }
    });

    t.equal(result.passed, true);
  });

  s.test("returns failure if provided function doesn't stop throwing errors within the timeout", async t => {
    let result = await passesEventually(() => {
      throw new Error('foobar');
    }, { timeout: 0 });

    t.equal(result.passed, false);
    t.match(result.failureMessage.toString(), /foobar/);
  });

  s.test("supports custom formatting for assertion errors", async t => {
    let result = await passesEventually(() => {
      t.assert(false);
    }, { timeout: 0 });

    t.equal(result.passed, false);
    t.match(result.failureMessage.toString(), /assert/);
  });

  s.test("works with falsy errors", async t => {
    let result = await passesEventually(() => {
      throw null;
    }, { timeout: 0 });

    t.equal(result.passed, false);
  });

  s.test("works with async function", async t => {
    let result = await passesEventually(async () => {
      throw new Error('foobar');
    }, { timeout: 0 });

    t.equal(result.passed, false);
  });

  s.describe("timers test", s => {
    s.test("stops trying after specified timeout", async (t) => {
      let resultPromise = passesEventually(() => {
        throw new Error('foobar');
      }, { timeout: 5, interval: 1 });

      let result = await resultPromise;

      t.equal(result.passed, false);
    });

    s.test("supports interval option", async (t) => {
      let counter = 0;
      let resultPromise = passesEventually(() => {
        counter += 1;
        throw new Error('foobar');
      }, { timeout: 5, interval: 1 });

      const result = await resultPromise;

      t.equal(result.passed, false);
      t.assert(counter >= 4);
    });
  });
});
