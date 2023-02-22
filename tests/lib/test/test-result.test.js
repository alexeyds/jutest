import jutest from "jutest";
import TestResult from "test/test-result";

jutest("TestResult", s => {
  s.describe("::passed", s => {
    s.test("returns passed test result", t => {
      let result = TestResult.passed({ testName: 'foobar' });

      t.equal(result.passed, true);
      t.equal(result.error, null);
      t.equal(result.testName, 'foobar');
    });
  });

  s.describe("::errored", s => {
    s.test("returns errored test result", t => {
      let result = TestResult.errored({ testName: 'foobar', error: "baz" });
  
      t.equal(result.passed, false);
      t.equal(result.error, "baz");
      t.equal(result.testName, 'foobar');
    });
  });
});
