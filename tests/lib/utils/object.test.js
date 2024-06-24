import { jutest } from "jutest";
import { deepMerge, isPlainObject, isEmpty } from "utils/object";

jutest("utils/object", s => {
  s.describe("deepMerge", s => {
    s.test("merges source object into the target", t => {
      let result = deepMerge({ a: 1, c: 3 }, { a: 2, b: 2});
      t.same(result, { a: 2, b: 2, c: 3 });
    });

    s.test("works with nested objects", t => {
      let result = deepMerge({ a: { b: 2 } }, { a: { c: 3 } });
      t.same(result, { a: { b: 2, c: 3 } });
    });

    s.test('overwrites non-object properties in the target', t => {
      let result = deepMerge({ a: 'a' }, { a: { b: 2 }});
      t.same(result, { a: { b: 2 } });
    });
  });

  s.describe('isPlainObject', s => {
    s.test("returns true if item is an object", t => {
      t.equal(isPlainObject({}), true);
    });

    s.test("returns false if item is not an object", t => {
      t.equal(isPlainObject([]), false);
      t.equal(isPlainObject(undefined), false);
      t.equal(isPlainObject(''), false);
    }); 
  });

  s.describe("isEmpty", s => {
    s.test("returns true if object is empty", t => {
      t.equal(isEmpty({}), true);
    });

    s.test("returns false if object is not empty", t => {
      t.equal(isEmpty({a: 1}), false);
    });
  });
});
