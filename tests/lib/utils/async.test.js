import jutest from "jutest";
import { createOrderedResolver } from "utils/async";

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
});
