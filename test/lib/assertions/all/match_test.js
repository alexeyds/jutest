import jutest from 'jutest';
import assertions from "assertions/all";

jutest('assertions.match()', s => {
  s.test('passes if string matches regexp', t => {
    let result = assertions.match('foobar', /foo/);

    t.equal(result.passed, true);
    t.equal(result.actual, 'foobar');
    t.same(result.expected, /foo/);
    t.equal(result.operator, 'match');
  });

  s.test('fails if string doesnt match regexp', t => {
    let result = assertions.match('foobar', /baz/);

    t.equal(result.passed, false);
    t.equal(result.actual, 'foobar');
    t.same(result.expected, /baz/);
    t.assert(result.failureDetails !== undefined);
  });
});