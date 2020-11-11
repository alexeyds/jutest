import jutest from 'jutest';
import TestResults from "test_results";

jutest('TestResults', s => {
  s.test('#all returns empty array by default', t => {
    let results = new TestResults();

    t.assert(Array.isArray(results.all));
    t.equal(results.all.length, 0);
  });

  s.test('#addTestResult adds new test result to list', t => {
    let results = new TestResults();
    results.addTestResult("foobar");

    t.equal(results.all.length, 1);
    t.equal(results.all[0], "foobar");
  });

  s.test('#addTestResult executes {onSingleTestResult} callback', t => {
    let myTestResult;
    let results = new TestResults({onSingleTestResult: (r) => myTestResult = r});
    results.addTestResult("foobar");

    t.equal(myTestResult, "foobar");
  });
});