import jutest from 'jutest';
import assertions from "assertions/all";

jutest('assertions.same()', s => {
  s.test('passes if two objects are equal', t => {
    let obj1 = {};
    let obj2 = {};
    let result = assertions.same(obj1, obj2);

    t.equal(result.passed, true);
    t.equal(result.actual, obj1);
    t.equal(result.expected, obj2);
    t.equal(result.operator, 'same');
  });

  s.test('fails if objects are different', t => {
    let result = assertions.same({a: 1}, {a: 2});

    t.equal(result.passed, false);
    t.assert(result.failureDetails !== undefined);
  });
});