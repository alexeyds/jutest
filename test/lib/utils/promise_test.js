import jutest from 'jutest';
import { resolveAsyncFunctionsInOrder, isPromise } from "utils/promise";

jutest('utils/promise', s => {
  s.describe('resolveAsyncFunctionsInOrder()', s => {
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

  s.describe("isPromise()", s => {
    s.test("returns true if object is a promise", t => {
      let promise = Promise.resolve();
      t.equal(isPromise(promise), true);
    });

    s.test("returns false if object is not a promise", t => {
      t.equal(isPromise(null), false);
      t.equal(isPromise(undefined), false);
      t.equal(isPromise({}), false);
    });
  });
});
