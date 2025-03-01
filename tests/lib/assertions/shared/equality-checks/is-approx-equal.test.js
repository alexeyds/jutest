import { jutest } from 'jutest';
import { isApproxEqual } from "assertions/shared/equality-checks";

jutest('isApproxEqual', s => {
  s.test("runs is-equal comparison on non-number pairs", t => {
    t.equal(isApproxEqual('foo', 'foo'), true);
    t.equal(isApproxEqual('foo', 321), false);
    t.equal(isApproxEqual(321, 'foo'), false);
    t.equal(isApproxEqual({}, {}), false);
  });

  s.test("retruns true if two numbers are equal", t => {
    t.equal(isApproxEqual(123, 123), true);
    t.equal(isApproxEqual(1.2345, 1.2345), true);
  });

  s.test("returns true if two numbers are equal within tolerance", t => {
    t.equal(isApproxEqual(0.300001, 0.3), true);
    t.equal(isApproxEqual(0.30000000001, 0.3), true);
    t.equal(isApproxEqual(4.4999999, 4.5), true);
    t.equal(isApproxEqual(-1.999999, -2), true);
    t.equal(isApproxEqual(-2.00000345, -2), true);
  });

  s.test("returns false if two numbers are not tolerance-equal", t => {
    t.equal(isApproxEqual(0.30001, 0.3), false);
    t.equal(isApproxEqual(-2.0000345, -2), false);
  });

  s.test("accepts tolerance param", t => {
    t.equal(isApproxEqual(0.300001, 0.3, { tolerance: 0.000001 }), false);
    t.equal(isApproxEqual(-2.00000345, -2, { tolerance: 0.000001 }), false);
  });

  s.test("works correctly with infinity/nan", t => {
    t.equal(isApproxEqual(-Infinity, -Infinity), true);
    t.equal(isApproxEqual(Infinity, Infinity), true);
    t.equal(isApproxEqual(Infinity, -Infinity), false);
    t.equal(isApproxEqual(NaN, NaN), true);
    t.equal(isApproxEqual(NaN, Infinity), false);
    t.equal(isApproxEqual('321', '321.00000001'), false);
  });
});
