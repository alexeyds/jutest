import jutest from 'jutest';
import { resolveAsyncFunctionsInOrder } from "utils/promise";

jutest('resolveAsyncFunctionsInOrder()', s => {
  s.test('executes given functions in order', async t => {
    let results = [];

    let functions = [
      async () => {
        await Promise.resolve();
        results.push('slow function');
      },
      () => {
        results.push('fast function');
      }
    ];

    await resolveAsyncFunctionsInOrder(functions);

    t.equal(results.length, 2);
    t.equal(results[0], 'slow function');
    t.equal(results[1], 'fast function');
  });
});