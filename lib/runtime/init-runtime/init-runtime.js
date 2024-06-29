import { RuntimeConfig, ORDER_TYPES } from "runtime/config";
import { TestRunner } from "test-runner";
import { shuffleArray } from "utils/shuffle-array";
import { isEmpty } from "utils/object";
import { discoverTestLocations } from "./discover-test-locations";
import { jutestInstance } from "jutest/instance";
import { inspect } from 'util';

export async function initRuntime(configParams) {
  let config = new RuntimeConfig(configParams);
  let fileLocations = orderLocations(config, discoverTestLocations(config));

  printConfigDetails(config);

  let runner = new TestRunner({
    fileLocations,
    randomizeOrder: config.order === ORDER_TYPES.random,
    seed: config.seed,
    onlyIncludeTags: config.onlyIncludeTags,
    excludeTags: config.excludeTags,
  });

  let reporters = config.reporters.map(reporter => {
    return reporter.initializeReporter(config, runner.eventEmitter);
  });

  let runSummary = await runner.run(jutestInstance);

  for (let reporter of reporters) {
    await reporter?.finishReporting?.(runSummary);
  }

  printConfigDetails(config);

  if (!runSummary.success) {
    process.exitCode = 1;
  }
}

function orderLocations(config, locations) {
  if (config.order === ORDER_TYPES.random) {
    return shuffleArray(locations, { seed: config.seed, getId: l => l.file });
  } else {
    return locations;
  }
}

function printConfigDetails(config) {
  let configDetails = [];

  let { onlyIncludeTags, excludeTags } = config;

  if (!isEmpty(onlyIncludeTags)) {
    configDetails.push(`Running tags: ${inspect(onlyIncludeTags)}`);
  } else if (!isEmpty(excludeTags)) {
    configDetails.push(`Excluding tags: ${inspect(excludeTags)}`);
  }

  if (config.order === ORDER_TYPES.random) {
    configDetails.push(`Randomized with seed ${config.seed}`);
  }

  if (configDetails.length) {
    config.stdout("\n" + configDetails.join("\n") + "\n\n");
  }
}
