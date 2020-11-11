import jutest from 'jutest';
import Expectations from "expectations";

jutest('Expectations', s => {
  function extractError(expectation) {
    try {
      expectation();
    } catch(e) {
      return e;
    }
  }

  s.describe("#throws", s => {
    s.test('passes if function throws matching error', t => {
      t.throws(() => { throw new Error('foobar'); }, 'foobar');
    });

    s.test('fails if function does not throw', t => {
      let result = extractError(() => Expectations.throws(() => {}, 'foobar'));

      t.assert(result.actual === 'No error');
      t.assert(result.expected === 'foobar');
      t.assert(result.operator === 'throws');
    });

    s.test('fails if function throws non-matching error', t => {
      let result = extractError(() => Expectations.throws(() => { throw undefined; }, 'baz'));

      t.assert(result.actual === undefined);
      t.assert(result.expected === 'baz');
      t.assert(result.operator === 'throws');
    });
  });

  s.describe("#equal", s => {
    s.test('passes if both objects are equal', t => {
      t.equal(1, 1);
    });

    s.test('fails if object are not equal', t => {
      let result = extractError(() => Expectations.equal(1, 2));

      t.assert(result.actual === 1);
      t.assert(result.expected === 2);
      t.assert(result.operator === 'equal');
    });
  });
});
