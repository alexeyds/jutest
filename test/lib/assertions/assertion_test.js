import jutest from 'jutest';
import Assertion, { AssertionFailedError } from "assertions/assertion";

jutest('Assertion', s => {
  s.describe("::create", s => {
    s.test("creates passed assertion", t => {
      let assertion = Assertion.create({expected: 1, actual: 1, passed: true, operator: 'equal'});

      t.equal(assertion.passed, true);
      t.equal(assertion.failureMessage, null);
      t.equal(assertion.actual, 1);
      t.equal(assertion.expected, 1);
      t.equal(assertion.operator, 'equal');
    });

    s.test("creates failed assertion", t => {
      let assertion = Assertion.create({expected: 1, actual: 2, passed: false, operator: 'equal'});

      t.equal(assertion.passed, false);
      t.match(assertion.failureMessage, /equal/);
      t.equal(assertion.expected, 1);
      t.equal(assertion.actual, 2);
      t.equal(assertion.operator, 'equal');
    });

    s.test("accepts {buildFailureMessage} option", t => {
      let buildFailureMessage = ({actual, expected, operator}) => `${actual} not ${operator} ${expected}`;
      let assertion = Assertion.create({passed: false, operator: 'equal', expected: 2, actual: 1, buildFailureMessage});

      t.equal(assertion.failureMessage, "1 not equal 2");
    });
  });

  s.describe("::negate", s => {
    s.test("negates passed assertion", t => {
      let assertion = Assertion.create({expected: 1, actual: 1, passed: true, operator: 'equal'});
      let negated = Assertion.negate(assertion, { operator: 'notEqual' });

      t.equal(negated.operator, 'notEqual');
      t.equal(negated.passed, false);
      t.match(negated.failureMessage, /notEqual/);
    });

    s.test("negates failed assertion", t => {
      let assertion = Assertion.create({expected: 1, actual: 2, passed: false, operator: 'equal'});
      let negated = Assertion.negate(assertion, { operator: 'notEqual' });

      t.equal(negated.operator, 'notEqual');
      t.equal(negated.passed, true);
      t.equal(negated.failureMessage, null);
    });

    s.test("accepts {buildFailureMessage} option", t => {
      let buildFailureMessage = ({actual, expected, operator}) => `${actual} should be ${operator} ${expected}`;
      let assertion = Assertion.create({expected: 1, actual: 1, passed: true, operator: 'equal'});
      let negated = Assertion.negate(assertion, { operator: 'notEqual', buildFailureMessage });

      t.equal(negated.failureMessage, "1 should be notEqual 1");
    });
  });

  s.describe("::ensurePassed", s => {
    s.test("returns true if assertion passed", t => {
      let result = Assertion.ensurePassed(Assertion.create({passed: true, operator: 'test'}));
      t.equal(result, true);
    });

    s.test("throws if assertion is failed", t => {
      let assertion = Assertion.create({passed: false, operator: 'test'});
      t.throws(() => Assertion.ensurePassed(assertion), AssertionFailedError);
    });
  });
});
