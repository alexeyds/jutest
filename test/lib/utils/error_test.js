import jutest from "jutest";
import { tryFunctionCall } from "utils/error";

jutest("utils/error", s => {
  s.describe("tryFunctionCall()", s => {
    s.test("returns success if function was executed", t => {
      let result = tryFunctionCall(() => 1);

      t.equal(result.success, true);
      t.equal(result.returnValue, 1);
      t.equal(result.error, null);
    });

    s.test("returns failure if function had thrown an error", t => {
      let error = new Error('test');
      let result = tryFunctionCall(() => { throw error; });

      t.equal(result.success, false);
      t.equal(result.returnValue, undefined);
      t.equal(result.error, error);
    });
  });
});
