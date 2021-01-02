import jutest from 'jutest';
import assertions from "assertions/all";

jutest('assertions/equal', s => {
  s.describe("equal()", s => {
    s.test('passes if two objects are equal', t => {
      let result = assertions.equal(1, 1);

      t.equal(result.passed, true);
      t.equal(result.actual, 1);
      t.equal(result.expected, 1);
      t.equal(result.operator, 'equal');
    });

    s.test('fails if objects are different', t => {
      let result = assertions.equal(1, 2);

      t.equal(result.passed, false);
      t.equal(result.actual, 1);
      t.equal(result.expected, 2);
      t.assert(result.failureDetails !== undefined);
    });

    s.test('uses Object.is', t => {
      t.equal(assertions.equal({}, {}).passed, false);
      t.equal(assertions.equal(-0, 0).passed, false);
    });
  });

  s.describe("notEqual()", s => {
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
  });
});