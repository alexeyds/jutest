import jutest from 'jutest';
import assertions from "assertions/all";

jutest('assertions.doesNotMatch()', s => {
  s.test('passes if string doesnt match regexp', t => {
    let result = assertions.doesNotMatch('foobar', /baz/);

    t.equal(result.passed, true);
    t.equal(result.actual, 'foobar');
    t.same(result.expected, /baz/);
    t.equal(result.operator, 'doesNotMatch');
  });

  s.test('fails if string matches regexp', t => {
    let result = assertions.doesNotMatch('foobar', /foo/);

    t.equal(result.passed, false);
    t.equal(result.actual, 'foobar');
    t.same(result.expected, /foo/);
    t.assert(result.failureDetails !== undefined);
  });
});