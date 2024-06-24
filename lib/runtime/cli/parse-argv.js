import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { ORDER_TYPES } from "runtime/config";
import { version } from "../../../package.json";

export function parseArgv(argv) {
  let parsedArgv = parseYargs(argv);
  let runtimeConfig = {};
  let { _: locationsToRun, seed, order, tags, excludeTags } = parsedArgv;

  if (locationsToRun.length) {
    runtimeConfig.locationsToRun = locationsToRun;
  }

  if (seed !== undefined) {
    runtimeConfig.seed = seed;
  }

  if (order) {
    runtimeConfig.order = order;
  }

  if (tags) {
    runtimeConfig.onlyIncludeTags = parseTags(tags);
  }

  if (excludeTags) {
    runtimeConfig.excludeTags = parseTags(excludeTags);
  }

  return {
    runtimeConfig,
    configFilePath: parsedArgv.config,
    parsedArgv,
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
  },
  onlyIncludeTags: {
    description: 'only run tests that match those tags',
    type: 'array',
    alias: 'tags',
  },
  excludeTags: {
    description: "don't run tests with those tags. Overriden by --tags",
    type: 'array',
  }
};

function parseTags(tags) {
  let result = {};

  for (let tag of tags) {
    let match = tag.match(/(.*)=(.*)/);

    if (match) {
      let [, tagName, tagValue] = match;
      result[tagName] = tagValue;
    } else {
      result[tag] = true;
    }
  }

  return result;
}
