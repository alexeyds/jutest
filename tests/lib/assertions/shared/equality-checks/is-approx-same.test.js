import { jutest } from 'jutest';
import { isApproxSame } from "assertions/shared/equality-checks";

jutest('isApproxSame', s => {
  s.test("compares numbers via isApproxEqual", t => {
    t.equal(isApproxSame(3.999999, 4), true);
    t.equal(isApproxSame(3.99999, 4), false);
  });

  s.test("passes non-comparable values to isApproxEqual", t => {
    t.equal(isApproxSame([], 0), false);
    t.equal(isApproxSame(0, []), false);
    t.equal(isApproxSame({}, undefined), false);
    t.equal(isApproxSame(undefined, {}), false);
    t.equal(isApproxSame('123', '123'), true);
    t.equal(isApproxSame(1, null), false);
    t.equal(isApproxSame(null, 1), false);
    t.equal(isApproxSame(undefined, null), false);
    t.equal(isApproxSame(null, undefined), false);
  });

  s.test("passes tolerance opts to isApproxEqual", t => {
    t.equal(isApproxSame(3.99999, 4, { tolerance: 0.0001 }), true);
    t.equal(isApproxSame(3.999999, 4, { tolerance: 0.000001 }), false);
  });

  s.test("compares arrays recursively", t => {
    t.equal(isApproxSame([[3.999999], 2.1000000004, 5], [[4], 2.1, 5]), true);
    t.equal(isApproxSame([[3.99999], 2.1, 5], [[4], 2.1, 5]), false);
  });

  s.test("handles arrays of different length", t => {
    t.equal(isApproxSame([1, 2], [1, 2, 3]), false);
    t.equal(isApproxSame([1, 2, 3], [1, 2]), false);
  });

  s.test("passes tolerance opts in array comparisons", t => {
    t.equal(isApproxSame([3.99999], [4], { tolerance: 0.0001 }), true);
    t.equal(isApproxSame([3.999999], [4], { tolerance: 0.000001 }), false);
  });

  s.test("compares objects recursively", t => {
    t.equal(isApproxSame({ a: { b: 3.999999 }, c: 2.1 }, { a: { b: 4 }, c: 2.1000000004 }), true);
    t.equal(isApproxSame({ a: { b: 3.99999 }, c: 2.1 }, { a: { b: 4 }, c: 2.1 }), false);
  });

  s.test("handles objects of different length", t => {
    t.equal(isApproxSame({ a: 1 }, { a: 1, b: 2 }), false);
    t.equal(isApproxSame({ a: 1, b: 2 }, { a: 1 }), false);
  });

  s.test("handles objects with different keys", t => {
    t.equal(isApproxSame({ a: 1, c: undefined }, { a: 1, b: 2 }), false);
    t.equal(isApproxSame({ a: 1, b: 2 }, { a: 1, c: undefined }), false);
  });

  s.test("passes tolerance opts in object comparisons", t => {
    t.equal(isApproxSame({ a: 3.99999 }, { a: 4 }, { tolerance: 0.0001 }), true);
    t.equal(isApproxSame({ a: 3.999999 }, { a: 4 }, { tolerance: 0.000001 }), false);
  });

  s.test("works with Float64Array", t => {
    t.equal(isApproxSame(new Float32Array([2, 3]), new Float32Array([2, 3])), true);
    t.equal(isApproxSame(new Float32Array([2, 3]), new Float32Array([3, 3])), false);
  });

  s.test("works with Float32Array", t => {
    t.equal(isApproxSame(new Float64Array([2, 3]), new Float64Array([2, 3])), true);
    t.equal(isApproxSame(new Float64Array([2, 3]), new Float64Array([3, 3])), false);
  });
});
