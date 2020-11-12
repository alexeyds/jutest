import jutest from 'jutest';
import assertions from "assertions/all";

jutest('assertions.notSame()', s => {
  s.test('fails if two objects are equal', t => {
    let obj1 = {};
    let obj2 = {};
    let result = assertions.notSame(obj1, obj2);

    t.equal(result.passed, false);
    t.equal(result.actual, obj1);
    t.equal(result.expected, obj2);
    t.equal(result.operator, 'notSame');
  });

  s.test('fails if objects are different', t => {
    let result = assertions.notSame({a: 1}, {a: 2});

    t.equal(result.passed, true);
    t.assert(result.failureDetails !== undefined);
  });

  s.test('uses strict equality comparsion', t => {
    let result = assertions.notSame({a: undefined}, {a: null});

    t.equal(result.passed, true);
  });
});