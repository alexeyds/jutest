import { jutest } from 'jutest';
import { rejects } from "assertions/matchers/async/rejects";

jutest('assertions/matchers/async/rejects', s => {
  s.test('fails if provided expression doesnt throw', async t => {
    let result = await rejects(Promise.resolve(), Error);

    t.equal(result.passed, false);
    t.match(result.failureMessage, /rejects/);
  });
});
