import jutest from 'jutest';
import assertions from "assertions/all";

jutest('assertions.throws()', s => {
  s.describe('basic behaviour', s => {
    s.test('passes if provided expression throws', t => {
      let result = assertions.throws(() => { throw 'foobar'; }, 'foobar');

      t.equal(result.passed, true);
      t.equal(result.actual, 'foobar');
      t.equal(result.expected, 'foobar');
      t.equal(result.operator, 'throws');
    });

    s.test('fails if provided expression doesnt throw', t => {
      let result = assertions.throws(() => { }, Error);

      t.equal(result.passed, false);
      t.equal(result.actual, undefined);
      t.equal(result.expected, Error);
      t.equal(result.operator, 'throws');
      t.match(result.failureMessage, /no errors/);
    });

    s.test("fails if error doesn't match the expectation", t => {
      let result = assertions.throws(() => { throw Error('baz'); }, 'bar');

      t.match(result.failureMessage, /baz/);
    });
  });
});