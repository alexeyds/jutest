import { RuntimeConfig } from "runtime/config";
import { TestRunner } from "test-runner";
import { discoverTestLocations } from "./discover-test-locations";
import { jutestInstance } from "jutest/instance";

export async function initRuntime(configParams) {
  let config = new RuntimeConfig(configParams);
  let fileLocations = discoverTestLocations(config);
  let runner = new TestRunner({ fileLocations });

  let reporters = config.reporters.map(reporter => {
    return reporter.initializeReporter(config.reportersConfig, runner.eventEmitter);
  });

  let runSummary = await runner.run(jutestInstance);

  for (let reporter of reporters) {
    await reporter?.finishReporting?.([runSummary]);
  }

  if (!runSummary.success) {
    process.exitCode = 1;
  }
}
