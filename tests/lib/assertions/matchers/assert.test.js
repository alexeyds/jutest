import jutest from 'jutest';
import { assert, refute } from "assertions/matchers/assert";

jutest('assertions/matchers/assert', s => {
  s.describe("assert()", s => {
    s.test('passes if target is true', t => {
      let result = assert(true);
      t.equal(result.passed, true);
    });

    s.test('fails if target is false', t => {
      let result = assert(false);

      t.equal(result.passed, false);
      t.match(result.failureMessage, /assert/);
    });

    s.test('works with truthy values', t => {
      let result = assert({});
      t.equal(result.passed, true);
    });
  });

  s.describe("refute()", s => {
    s.test('passes if target is false', t => {
      let result = refute(false);
      t.equal(result.passed, true);
    });

    s.test('fails if target is true', t => {
      let result = refute(true);

      t.equal(result.passed, false);
      t.match(result.failureMessage, /refute/);
    });

    s.test('works with falsy values', t => {
      let result = refute(0);
      t.equal(result.passed, true);
    });
  });
});
