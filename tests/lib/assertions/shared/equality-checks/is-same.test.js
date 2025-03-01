import { jutest } from "jutest";
import { isSame } from "assertions/shared/equality-checks";

jutest("isSame", s => {
  s.test('returns true if objects are the same', t => {
    t.equal(isSame({a: 1}, {a: 1}), true);
    t.equal(isSame([1, 2, 3], [1, 2, 3]), true);
    t.equal(isSame(32, 32), true);
    t.equal(isSame('foo', 'foo'), true);
    t.equal(isSame(undefined, undefined), true);
  });

  s.test('returns false if objects are different', t => {
    t.equal(isSame({a: 1}, {a: 2}), false);
    t.equal(isSame([1, 2, 3], [1, 3, 2]), false);
    t.equal(isSame(32, 31), false);
    t.equal(isSame('foo', 'bar'), false);
  });

  s.test('uses strict equality comparsion', t => {
    t.equal(isSame({ a: undefined }, { a: null }), false);
  });
});
