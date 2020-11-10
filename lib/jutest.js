import Test from "test";
import ProgressReporter from 'reporters/progress_reporter';

class JUTest {
  constructor() {
    this._tests = [];
    this._reporter = new ProgressReporter();
  }

  test(name, body) {
    this._tests.push(new Test({name, body}));
  }

  async autoRun() {
    await Promise.all(this._tests.map(async t => {
      this._reporter.reportTestResult(await t.run());
    }));
    
    this._reporter.reportSummary();
  }
}

export default new JUTest();
