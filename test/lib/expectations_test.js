import jutest from 'jutest';
import Expectations from "expectations";

jutest('Expectations', s => {
  s.test('#equal passes if both objects are equal', t => {
    let result = Expectations.equal(1, 1);
    t.assert(result);
  });

  s.test('#equal fails if object are not equal', t => {
    let result;

    try {
      Expectations.equal(1, 2);
    } catch(e) {
      result = e;
    }

    t.assert(result.actual === 1);
    t.assert(result.expected === 2);
    t.assert(result.operator === 'equal');
  });
});
