import { Jutest } from "core";
import { TestRunner } from "test-runner";

export class TestRuntime {
  constructor({ reporter=null, runAsFile=null }={}) {
    this._reporter = reporter;
    this._runAsFile = runAsFile;
  }

  static runWithReporter(reporter, defineSpecs) {
    let runtime = new TestRuntime({ reporter });
    return runtime.defineAndRun(defineSpecs);
  }

  async defineAndRun(defineSpecs) {
    let jutestInstance = new Jutest();

    await jutestInstance.specsContainer.withSourceFilePath(this._runAsFile, async () => {
      await defineSpecs(jutestInstance.toPublicAPI());
    });

    let runner = new TestRunner();
    this._reporter?.registerListeners?.(runner.eventEmitter);
    let runSummary = await runner.run(jutestInstance);
    await this._reporter?.finishReporting?.([runSummary]);
  }
}
