import { Jutest } from "core";
import { TestRunner } from "test-runner";

export class TestRuntime {
  constructor({ reporterClass=null, runtimeConfig=undefined, runAsFile=null }={}) {
    this._reporterClass = reporterClass;
    this._runtimeConfig = runtimeConfig;
    this._runAsFile = runAsFile;
  }

  static runWithReporter({ reporterClass, runtimeConfig }, defineSpecs) {
    let runtime = new TestRuntime({ reporterClass, runtimeConfig });
    return runtime.defineAndRun(defineSpecs);
  }

  async defineAndRun(defineSpecs) {
    let jutestInstance = new Jutest();

    await jutestInstance.specsContainer.withSourceFilePath(this._runAsFile, async () => {
      await defineSpecs(jutestInstance.toPublicAPI());
    });

    let runner = new TestRunner();
    let reporter = this._reporterClass?.initializeReporter?.(this._runtimeConfig, runner.eventEmitter);
    let runSummary = await runner.run(jutestInstance);
    await reporter?.finishReporting?.([runSummary]);
  }
}
