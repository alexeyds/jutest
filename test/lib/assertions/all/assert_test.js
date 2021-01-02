import jutest from 'jutest';
import assertions from "assertions/all";

jutest('assertions/assert', s => {
  s.describe("assert()", s => {
    s.test('passes if target is true', t => {
      let result = assertions.assert(true);

      t.equal(result.passed, true);
      t.equal(result.actual, true);
      t.equal(result.expected, true);
      t.equal(result.operator, 'assert');
    });

    s.test('fails if target is false', t => {
      let result = assertions.assert(false);

      t.equal(result.passed, false);
      t.equal(result.actual, false);
      t.equal(result.expected, true);
      t.assert(result.failureDetails !== undefined);
    });

    s.test('works with truthy values', t => {
      let result = assertions.assert({});
      t.equal(result.passed, true);
    });
  });

  s.describe("refute()", s => {
    s.test('passes if target is false', t => {
      let result = assertions.refute(false);

      t.equal(result.passed, true);
      t.equal(result.actual, false);
      t.equal(result.expected, false);
      t.equal(result.operator, 'refute');
    });

    s.test('fails if target is true', t => {
      let result = assertions.refute(true);

      t.equal(result.passed, false);
      t.equal(result.actual, true);
      t.equal(result.expected, false);
      t.assert(result.failureDetails !== undefined);
    });
  });
});