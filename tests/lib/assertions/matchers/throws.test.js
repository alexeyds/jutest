import { jutest } from 'jutest';
import { throws } from "assertions/matchers/throws";

jutest('assertions/matchers/throws', s => {
  s.describe('throws()', s => {
    s.test('fails if provided expression doesnt throw', t => {
      let result = throws(() => { }, Error);

      t.equal(result.passed, false);
      t.match(result.failureMessage, /throws/);
    });
  });
});
