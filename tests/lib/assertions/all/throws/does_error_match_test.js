import jutest from "jutest";
import doesErrorMatch from "assertions/all/throws/does_error_match";

jutest("doesErrorMatch()", s => {
  s.describe("string matcher", s => {
    s.test("returns true if error if the same string", t => {
      t.equal(doesErrorMatch('foo', 'foo'), true);
    });

    s.test("fails if error is not the same string", t => {
      t.equal(doesErrorMatch('bar', 'baz'), false);
    });

    s.test("allows partial matches", t => {
      t.equal(doesErrorMatch('bars', 'bar'), true);
    });

    s.test("matches error message", t => {
      t.equal(doesErrorMatch(new Error('bars'), 'bar'), true);
    });

    s.test("matches error name", t => {
      t.equal(doesErrorMatch(new Error(), 'Error'), true);
    });

    s.test("matches error name exactly", t => {
      t.equal(doesErrorMatch(new Error(), 'Err'), false);
    });

    s.test("returns false by default", t => {
      t.equal(doesErrorMatch(undefined, 'bar'), false);
    });
  });

  s.describe('regexp error matcher', s => {
    s.test('passes if regexp matches string', t => {
      t.equal(doesErrorMatch('foo', /foo/), true);
    });

    s.test("fails if regexp doesn't match string", t => {
      t.equal(doesErrorMatch('bar', /baz/), false);
    });

    s.test("passes if error message mathes", t => {
      t.equal(doesErrorMatch(new Error('bars'), /bar/), true);
    });

    s.test("returns false by default", t => {
      t.equal(doesErrorMatch(undefined, /bar/), false);
    });
  });

  s.describe('Class error matcher', s => {
    s.test('passes if error class matches', t => {
      t.equal(doesErrorMatch(new Error(), Error), true);
    });

    s.test("fails if error class doesn't match", t => {
      t.equal(doesErrorMatch(new Error(), SyntaxError), false);
    });

    s.test("returns false by default", t => {
      t.equal(doesErrorMatch(undefined, Error), false);
    });
  });

  s.describe('random matchers', s => {
    s.test('match error exactly', t => {
      t.equal(doesErrorMatch(undefined, undefined), true);
      t.equal(doesErrorMatch(undefined, null), false);
      t.equal(doesErrorMatch(123, 123), true);
    });
  });
});
