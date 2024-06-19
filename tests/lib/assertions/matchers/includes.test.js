import { jutest } from 'jutest';
import { includes, excludes } from "assertions/matchers/includes";

jutest('assertions/matchers/includes', s => {
  s.describe("includes()", s => {
    s.test("passes if array includes an item", t => {
      let result = includes([1, 2], 1);
      t.equal(result.passed, true);
    });

    s.test('fails if array does not include an item', t => {
      let result = includes([1, 2], 3);

      t.equal(result.passed, false);
      t.match(result.failureMessage.toString(), /includes/);
    });

    s.test("supports strings", t => {
      let result = includes('foobar', 'foo');
      t.equal(result.passed, true);
    });
  });

  s.describe("excludes()", s => {
    s.test("passes if array does not include an item", t => {
      let result = excludes([1, 2], 3);
      t.equal(result.passed, true);
    });

    s.test('fails if array does not include an item', t => {
      let result = excludes([1, 2], 2);

      t.equal(result.passed, false);
      t.match(result.failureMessage.toString(), /excludes/);
    });
  });
});