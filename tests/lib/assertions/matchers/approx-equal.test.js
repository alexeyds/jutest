import { jutest } from 'jutest';
import { approxEqual, notApproxEqual } from "assertions/matchers/approx-equal";

jutest('assertions/matchers/approx-equal', s => {
  s.describe("approxEqual()", s => {
    s.test('passes if two numbers are approx equal', t => {
      let result = approxEqual(1.000000005, 1);
      t.equal(result.passed, true);
    });

    s.test('fails if two numbers are approx equal', t => {
      let result = approxEqual(1.1, 1);

      t.equal(result.passed, false);
      t.match(result.failureMessage.toString(), /approxEqual/);
    });

    s.test('compares non-numbers', t => {
      t.equal(approxEqual('1', 1).passed, false);
      t.equal(approxEqual('foo', 'foo').passed, true);
    });

    s.test('supports tolerance opts', t => {
      let result = approxEqual(1, 1.0001, { tolerance: 0.0001 });
      t.equal(result.passed, true);
    });
  });

  s.describe("notApproxEqual()", s => {
    s.test('passes if two numbers are not equal', t => {
      t.equal(notApproxEqual(1.1, 1).passed, true);
    });

    s.test('fails if numbers are equal', t => {
      let result = notApproxEqual(1.000000005, 1);

      t.equal(result.passed, false);
      t.match(result.failureMessage.toString(), /notApproxEqual/);
    });
  });
});
