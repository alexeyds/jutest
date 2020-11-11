import jutest from 'jutest';
import assertions from "assertions/all";

jutest('assertions.fail()', s => {
  s.test('returns failed assertion', t => {
    let result = assertions.fail('foobar');

    t.equal(result.passed, false);
    t.equal(result.operator, 'fail');
  });

  s.test('can be inspected', t => {
    let result = assertions.fail('foobar');
    t.assert(result.failureDetails.match(/foobar/));
  });
});