import { jutest } from 'jutest';
import { throws } from "assertions/matchers/throws";

jutest('assertions/matchers/throws', s => {
  s.describe('throws()', s => {
    s.test('passes if provided expression throws', t => {
      let result = throws(() => { throw 'foobar'; }, 'foobar');
      t.equal(result.passed, true);
    });

    s.test('fails if provided expression doesnt throw', t => {
      let result = throws(() => { }, Error);

      t.equal(result.passed, false);
      t.match(result.failureMessage, /throws/);
    });

    s.test("fails if error doesn't match the expectation", t => {
      let result = throws(() => { throw Error('baz'); }, 'bar');

      t.match(result.failureMessage, /baz/);
      t.match(result.failureMessage, /throws/);
    });
  });
});
