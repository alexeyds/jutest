import jutest from 'jutest';
import Assertion, { AssertionFailedError, AssertionResult, negateAssertion } from "assertions/assertion";

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

  s.describe("AssertionResult", s => {
    s.test("creates result", t => {
      let result = new AssertionResult({
        passed: false,
        operator: 'equal',
        expected: 1,
        actual: 2
      });

      t.equal(result.passed, false);
      t.equal(result.operator, 'equal');
      t.equal(result.negated, false);
      t.equal(result.expected, 1);
      t.equal(result.actual, 2);
    });

    s.test("has #negate method", t => {
      let result = new AssertionResult({
        passed: false,
        operator: 'equal',
        expected: 1,
        actual: 2
      });

      let negated = result.negate({ operator: 'notEqual' });

      t.notEqual(negated, result);
      t.equal(negated.passed, true);
      t.equal(negated.negated, true);
      t.equal(negated.operator, 'notEqual');
      t.equal(negated.expected, 1);
      t.equal(negated.actual, 2);
    });
  });

  s.describe("negateAssertion", s => {
    s.test("negates assertion result", t => {
      let assertion = () => new AssertionResult({
        passed: false,
        operator: 'equal'
      });

      let negatedAssertion = negateAssertion(assertion, { operator: 'notEqual' });
      let result = negatedAssertion();

      t.equal(negatedAssertion.name, 'notEqual');
      t.equal(result.passed, true);
      t.equal(result.operator, 'notEqual');
    });

    s.test("delegates all arguments to the original function", t => {
      let assertion = (actual, expected) => new AssertionResult({
        passed: true,
        actual,
        expected
      });
      let result = negateAssertion(assertion, { operator: 'notEqual' })(5, 1);

      t.equal(result.actual, 5);
      t.equal(result.expected, 1);
    });
  });
});
