import { jutest } from 'jutest';
import { approxSame, notApproxSame } from "assertions/matchers/approx-same";

jutest('assertions/matchers/approx-equal', s => {
  s.describe("approxSame()", s => {
    s.test('passes if two objects are approx same', t => {
      let result = approxSame([1.000000005], [1]);
      t.equal(result.passed, true);
    });

    s.test('fails if two objects are different', t => {
      let result = approxSame([1.1], [1]);

      t.equal(result.passed, false);
      t.match(result.failureMessage.toString(), /approxSame/);
    });

    s.test('compares non-objects', t => {
      t.equal(approxSame('1', 1).passed, false);
      t.equal(approxSame('foo', 'foo').passed, true);
      t.equal(approxSame(1.2, 1.200004).passed, true);
    });

    s.test('supports tolerance opts', t => {
      let result = approxSame([1], [1.0001], { tolerance: 0.0001 });
      t.equal(result.passed, true);
    });
  });

  s.describe("notApproxSame()", s => {
    s.test('passes if two objects are not same', t => {
      t.equal(notApproxSame([1.1], [1]).passed, true);
    });

    s.test('fails if objects are same', t => {
      let result = notApproxSame([1.000000005], [1]);

      t.equal(result.passed, false);
      t.match(result.failureMessage.toString(), /notApproxSame/);
    });
  });
});
