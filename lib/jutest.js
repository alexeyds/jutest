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

  autoRun() {
    this._tests.forEach(t => {
      this._reporter.reportTestResult(t.run());
    });
    
    this._reporter.reportSummary();
  }
}

export default new JUTest();