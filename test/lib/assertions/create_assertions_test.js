import jutest from 'jutest';
import createAssertions from "assertions/create_assertions";

jutest('createAssertions()', s => {
  s.test('returns assertions object', t => {
    let assertions = createAssertions();

    t.equal(assertions.equal(1, 1), true);
    t.equal(assertions.assert(true), true);
  });

  s.test('throws an error if an assertion didnt pass', t => {
    let assertions = createAssertions();
    let error;

    try {
      assertions.equal(1, 2);
    } catch(e) {
      error = e;
    }

    t.assert(error.message !== undefined);
  });
});