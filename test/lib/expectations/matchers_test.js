import jutest from 'jutest';
import { errorMatches } from "expectations/matchers";

jutest('expectations/matchers', s => {
  s.describe("errorMatches()", s => {
    s.describe('with string expectation', s => {
      s.test('returns true if error matches', t => {
        t.equal(errorMatches('foo', 'foo'), true);
      });

      s.test("returns false if error doesn't match", t => {
        t.equal(errorMatches('bar', 'baz'), false);
      });

      s.test("matches string only partially", t => {
        t.equal(errorMatches('bars', 'bar'), true);
      });

      s.test("matches error message", t => {
        t.equal(errorMatches(new Error('bars'), 'bar'), true);
      });

      s.test("works with undefined", t => {
        t.equal(errorMatches(undefined, 'bar'), false);
      });

      s.test("matches error name", t => {
        t.equal(errorMatches(new Error(), 'Error'), true);
      });
    });

    s.describe('with regexp expectation', s => {
      s.test('returns true if error matches', t => {
        t.equal(errorMatches('foo', /foo/), true);
      });

      s.test("returns false if error doesn't match", t => {
        t.equal(errorMatches('bar', /baz/), false);
      });

      s.test("matches error message", t => {
        t.equal(errorMatches(new Error('bars'), /bar/), true);
      });

      s.test("works with undefined", t => {
        t.equal(errorMatches(undefined, /bar/), false);
      });
    });

    s.describe('with error class expectation', s => {
      s.test('returns true if class matches', t => {
        t.equal(errorMatches(new Error(), Error), true);
      });

      s.test("returns false if error doesn't match", t => {
        t.equal(errorMatches(new Error(), SyntaxError), false);
      });

      s.test("works with undefined", t => {
        t.equal(errorMatches(undefined, Error), false);
      });
    });

    s.describe('with other expectations', s => {
      s.test('matches error exactly', t => {
        t.equal(errorMatches(undefined, undefined), true);
        t.equal(errorMatches(undefined, null), false);
        t.equal(errorMatches(123, 123), true);
      });
    });
  });
});
