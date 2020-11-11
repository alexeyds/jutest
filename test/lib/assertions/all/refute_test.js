import jutest from 'jutest';
import assertions from "assertions/all";

jutest('assertions.refute()', s => {
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