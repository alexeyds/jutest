import { jutest } from "./jutest-instance";

jutest("main suite", s => {
  s.test("test 1", t => {
    t.fail('123');
  });

  s.describe("nested suite 1", s => {
    s.test("test 2", () => {});
    s.xtest("test 3", () => {});
  });

  s.xdescribe("skipped suite", s => {
    s.test("test 4", () => {});
  });
});

jutest.test('standalone test', () => {

});
