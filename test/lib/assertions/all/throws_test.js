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
      t.assert(result.failureDetails !== undefined);
    });

    s.test("fails if error doesn't match the expectation", t => {
      let result = assertions.throws(() => { throw Error('baz'); }, 'bar');

      t.assert(result.failureDetails !== undefined);
    });
  });

  function errorMatches(error, matcher) {
    let result = assertions.throws(() => { throw error; }, matcher);
    return result.passed;
  }

  s.describe('string error matcher', s => {
    s.test('passes if error is same string', t => {
      t.equal(errorMatches('foo', 'foo'), true);
    });

    s.test("fails if error is not the same", t => {
      t.equal(errorMatches('bar', 'baz'), false);
    });

    s.test("passes if error matches partially", t => {
      t.equal(errorMatches('bars', 'bar'), true);
    });

    s.test("passes if error message matches", t => {
      t.equal(errorMatches(new Error('bars'), 'bar'), true);
    });

    s.test("passes if error name matches", t => {
      t.equal(errorMatches(new Error(), 'Error'), true);
    });

    s.test("works with undefined", t => {
      t.equal(errorMatches(undefined, 'bar'), false);
    });
  });

  s.describe('regexp error matcher', s => {
    s.test('passes if regexp matches string', t => {
      t.equal(errorMatches('foo', /foo/), true);
    });

    s.test("fails if regexp doesn't match string", t => {
      t.equal(errorMatches('bar', /baz/), false);
    });

    s.test("passes if error message mathes", t => {
      t.equal(errorMatches(new Error('bars'), /bar/), true);
    });

    s.test("works with undefined", t => {
      t.equal(errorMatches(undefined, /bar/), false);
    });
  });

  s.describe('Class error matcher', s => {
    s.test('passes if error class matches', t => {
      t.equal(errorMatches(new Error(), Error), true);
    });

    s.test("fails if error class doesn't match", t => {
      t.equal(errorMatches(new Error(), SyntaxError), false);
    });

    s.test("works with undefined", t => {
      t.equal(errorMatches(undefined, Error), false);
    });
  });

  s.describe('random matchers', s => {
    s.test('match error exactly', t => {
      t.equal(errorMatches(undefined, undefined), true);
      t.equal(errorMatches(undefined, null), false);
      t.equal(errorMatches(123, 123), true);
    });
  });
});