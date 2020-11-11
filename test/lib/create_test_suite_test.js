import jutest from 'jutest';
import createSuite from "create_test_suite";
import TestResults from "test_results";

jutest('createSuite()', s => {
  s.test("adds test result to testResults", async t => {
    let testResults = new TestResults();
    let suiteBody = s => {
      s.test('good test', (t) => t.assert(true));
    };

    let runSuite = createSuite({suiteName: 'my suite', suiteBody, testResults});
    await runSuite();

    t.equal(testResults.all.length, 1);
    let result = testResults.all[0];
    t.equal(result.passed, true);
    t.assert(result.testName.includes('good test'));
  });

  s.test("runs tests in order they were defined", async t => {
    let testResults = new TestResults();
    let suiteBody = s => {
      s.test('slow test', async () => await Promise.resolve());
      s.test('fast test', () => {});
    };

    let runSuite = createSuite({suiteName: 'my suite', suiteBody, testResults});
    await runSuite();

    let [result_1, result_2] = testResults.all;
    t.assert(result_1.testName.includes('slow test'));
    t.assert(result_2.testName.includes('fast test'));
  });

  s.test("allows nested suites", async t => {
    let testResults = new TestResults();
    let suiteBody = s => {
      s.describe('nested scope', s => {
        s.test('nested test', () => {});
      });

      s.test('top-level test', () => {});
    };

    let runSuite = createSuite({suiteName: 'my suite', suiteBody, testResults});
    await runSuite();

    t.equal(testResults.all.length, 2);
    let [result_1, result_2] = testResults.all;
    t.assert(result_1.testName.includes('nested test'));
    t.assert(result_2.testName.includes('top-level test'));
  });

  s.test("prepends suiteName to both tests and nested suite names", async t => {
    let testResults = new TestResults();
    let suiteBody = s => {
      s.describe('nested suite', s => {
        s.test('nested test', () => {});
      });

      s.test('nested test', () => {});
    };

    let runSuite = createSuite({suiteName: 'top suite', suiteBody, testResults});
    await runSuite();

    let [result_1, result_2] = testResults.all;
    t.equal(result_2.testName, 'top suite nested test');
    t.equal(result_1.testName, 'top suite nested suite nested test');
  });

  s.test('throws if suiteBody is an async function', t => {
    t.throws(() => {
      createSuite({suiteName: '', suiteBody: async () => {} });
    }, /async/);
  });
});
