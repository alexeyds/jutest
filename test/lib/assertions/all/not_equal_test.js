import jutest from 'jutest';
import assertions from "assertions/all";

jutest('assertions.notEqual()', s => {
  s.test('passes if two objects are not equal', t => {
    let result = assertions.notEqual(1, 2);

    t.equal(result.passed, true);
    t.equal(result.actual, 1);
    t.equal(result.expected, 2);
    t.equal(result.operator, 'notEqual');
  });

  s.test('fails if objects are equal', t => {
    let result = assertions.notEqual(1, 1);

    t.equal(result.passed, false);
    t.equal(result.actual, 1);
    t.equal(result.expected, 1);
    t.assert(result.failureDetails !== undefined);
  });

  s.test('uses Object.is', t => {
    t.equal(assertions.notEqual({}, {}).passed, true);
    t.equal(assertions.notEqual(-0, 0).passed, true);
  });
});