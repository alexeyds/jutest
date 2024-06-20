import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { ORDER_TYPES } from "runtime/config";
import { version } from "../../../package.json";

export function parseArgv(argv) {
  let parsedArgv = parseYargs(argv);
  let runtimeConfig = {};

  let { _: locationsToRun, seed, order } = parsedArgv;

  if (locationsToRun.length) {
    runtimeConfig.locationsToRun = locationsToRun;
  }

  if (seed !== undefined) {
    runtimeConfig.seed = seed;
  }

  if (order) {
    runtimeConfig.order = order;
  }

  return {
    runtimeConfig,
    configFilePath: parsedArgv.config,
  };
}

function parseYargs(argv) {
  return yargs(hideBin(argv))
    .usage('Usage: $0 [options] [locations to run]')
    .version(version)
    .alias('version', 'v')
    .alias('help', 'h')
    .options(options)
    .parse();
}

let options = {
  config: {
    description: 'custom path to jutest config file',
    type: 'string',
  },
  seed: {
    description: 'seed to use for the random ordering of tests',
    type: 'number',
  },
  order: {
    description: 'ordering mechanism to use when running tests',
    type: 'string',
    choices: Object.values(ORDER_TYPES),
  }
};
