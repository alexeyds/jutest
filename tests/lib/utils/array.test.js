import { jutest } from "jutest";
import { sum } from "utils/array";

jutest("utils/array", s => {
  s.describe("sum", s => {
    s.test("returns sum of all elements", t => {
      t.equal(sum([1, 2, 3]), 6);
    });

    s.test("accepts mapper function", t => {
      let result = sum([
        {a: 1},
        {a: 2},
        {a: 3},
      ], i => i.a);

      t.equal(result, 6);
    });
  });
});
