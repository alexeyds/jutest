import { jutest } from "jutest";
import { NegatableFailureMessage, negateMatcher } from "assertions/shared";

jutest("assertions/shared/negatable-matcher", s => {
  s.describe("NegatableFailureMessage", s => {
    s.test("has #toString method", t => {
      let message = new NegatableFailureMessage({ operator: 'same', expected: 1, actual: 2 });
      t.match(message.toString(), /same/);
    });

    s.test("has #negate method", t => {
      let message = new NegatableFailureMessage({ operator: 'same', expected: 1, actual: 2 });
      let negatedMessage = message.negate({ operator: 'notSame' });

      t.notEqual(message, negatedMessage);
      t.match(negatedMessage.toString(), /notSame/);
      t.match(negatedMessage.toString(), /not 1/);
    });
  });

  s.describe("negateMatcher", s => {
    s.test("negates assertion result", t => {
      let failureMessage = new NegatableFailureMessage({ operator: 'equal', expected: 1, actual: 1 });
      let matcher = () => ({ passed: true, failureMessage });

      let negated = negateMatcher(matcher, { operator: 'notEqual' });
      let result = negated();

      t.equal(result.passed, false);
      t.match(result.failureMessage.toString(), /notEqual/);
    });

    s.test("delegates all arguments to negated assertion", t => {
      let matcher = (passed) => ({ passed, failureMessage: new NegatableFailureMessage({}) });
      let negated = negateMatcher(matcher, { operator: 'notEqual' });

      t.equal(negated(true).passed, false);
      t.equal(negated(false).passed, true);
    });

    s.test("adds name to negated assertion", t => {
      let matcher = () => ({ passed: true, failureMessage: new NegatableFailureMessage({}) });
      let negated = negateMatcher(matcher, { operator: 'notEqual' });

      t.equal(negated.name, 'notEqual');
    });
  });
});
