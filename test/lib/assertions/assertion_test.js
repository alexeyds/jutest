import jutest from 'jutest';
import Assertion from "assertions/assertion";

jutest('Assertion', s => {
  s.describe('constructor', s => {
    s.test('creates assertion with given properties', t => {
      let assertion = new Assertion({
        expected: 1,
        actual: 2,
        passed: false,
        operator: 'foobar'
      });

      t.equal(assertion.expected, 1);
      t.equal(assertion.actual, 2);
      t.equal(assertion.passed, false);
      t.equal(assertion.operator, 'foobar');
    });
  });

  s.describe('#failureDetails', s => {
    s.test('inspects assertion', t => {
      let assertion = new Assertion({
        expected: 1,
        actual: 2,
        passed: false,
        operator: 'foobar'
      });

      t.assert(!!assertion.failureDetails.match('foobar'));
    });

    s.test('uses provided getFailureDetails function', t => {
      let assertion = new Assertion({
        getFailureDetails: () => 'custom failure details'
      });

      t.equal(assertion.failureDetails, 'custom failure details');
    });
  });
});