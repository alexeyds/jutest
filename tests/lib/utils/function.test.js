import { jutest } from "jutest";
import { nameFunction } from "utils/function";

jutest("utils/function", s => {
  s.describe("nameFunction()", s => {
    s.test("assigns name to a function", t => {
      let func = () => {};
      nameFunction(func, 'foobar');

      t.equal(func.name, 'foobar');
    });
  });
});
