import { jutest } from 'jutest';
import { match, doesNotMatch } from "assertions/matchers/match";

jutest('assertions/matchers/match', s => {
  s.describe("match()", s => {
    s.test("passes if string matches given regexp", t => {
      let result = match('foobar', /foo/);
      t.equal(result.passed, true);
    });

    s.test('fails if string doesnt match regexp', t => {
      let result = match('foobar', /baz/);

      t.equal(result.passed, false);
      t.match(result.failureMessage.toString(), /match/);
    });

    s.test("works with non-regex objects", t => {
      let result = match('foobar', 'foo');
      t.equal(result.passed, true);
    });
  });

  s.describe("doesNotMatch()", s => {
    s.test('passes if string doesnt match regexp', t => {
      let result = doesNotMatch('foobar', /baz/);
      t.equal(result.passed, true);
    });

    s.test('fails if string matches regexp', t => {
      let result = doesNotMatch('foobar', /foo/);

      t.equal(result.passed, false);
      t.match(result.failureMessage.toString(), /doesNotMatch/);
    });
  });
});