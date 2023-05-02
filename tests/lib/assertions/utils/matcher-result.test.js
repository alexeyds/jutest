import { jutest } from "jutest";
import { success, failure } from "assertions/utils/matcher-result";

jutest("matcher-result", s => {
  s.describe("success()", s => {
    s.test("returns successfull result", t => {
      let result = success();

      t.equal(result.passed, true);
      t.refute(result.failureMessage);
    });
  });

  s.describe("failure()", s => {
    s.test("returns failed result", t => {
      let result = failure('test');

      t.equal(result.passed, false);
      t.equal(result.failureMessage, 'test');
    });
  });
});
