import jutest from "jutest";
import { reduceAsync, createOrderedResolver } from "utils/async";

jutest("utils/async", s => {
  s.describe("createOrderedResolver", s => {
    s.test("resolves provided functions in order", async t => {
      let results = [];
      let slowFunc = async () => {
        await Promise.resolve();
        results.push('slow function');
      };
      let fastfunc = () => results.push('fast function');

      let resolver = createOrderedResolver([slowFunc, fastfunc]);
      await resolver();

      t.same(results, ['slow function', 'fast function']);
    });

    s.test("passes all arguments from resolver to the functions", async t => {
      let result;
      let func = (arg) => result = arg;

      let resolver = createOrderedResolver([func]);
      await resolver('test');

      t.equal(result, 'test');
    });
  });

  s.describe("reduceAsync", s => {
    s.test("returns initial value if array is empty", async t => {
      let initalValue = {};
      let result = await reduceAsync([], initalValue, () => {});

      t.equal(result, initalValue);
    });

    s.test("passes every value and acc through reducer function", async t => {
      let result = await reduceAsync([1, 2, 3], 0, (acc, val) => acc+val);
      t.equal(result, 6);
    });

    s.test("supports async reducers", async t => {
      let result = await reduceAsync([1, 2, 3], 0, async (acc, val) => acc+val);
      t.equal(result, 6);
    });
  });
});
