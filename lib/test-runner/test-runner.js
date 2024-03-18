import { measureTimeElapsed } from "utils/time";
import { TestRunnerContext } from "./context";
import { loadSpecs } from "./load-specs";
import { runSpecs } from "./run-specs";

export class TestRunner {
  constructor(config) {
    this._context = new TestRunnerContext(config);
  }

  async run(jutestInstance) {
    let context = this._context;
    let { runSummary } = context;

    let { time } = await measureTimeElapsed(async () => {
      let specsByFile = await loadSpecs(jutestInstance, context);
      await runSpecs(specsByFile, context);
    });

    runSummary.setRunTime(time);

    return this._context.runSummary;
  }

  get eventEmitter() {
    return this._context.eventEmitter;
  }
}
