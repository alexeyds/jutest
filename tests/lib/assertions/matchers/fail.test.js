import { jutest } from 'jutest';
import { fail } from "assertions/matchers/fail";

jutest('assertions/matchers/fail', s => {
  s.describe("fail()", s => {
    s.test("fails with given message", t => {
      let result = fail('foobartest');

      t.equal(result.passed, false);
      t.equal(result.failureMessage, 'foobartest');
    });
  });
});