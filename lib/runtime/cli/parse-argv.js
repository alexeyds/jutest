import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { version } from "../../../package.json";

export function parseArgv(argv) {
  let parsedArgv = parseYargs(argv);
  let runtimeConfig = {};

  let { _: locationsToRun } = parsedArgv;

  if (locationsToRun.length) {
    runtimeConfig.locationsToRun = locationsToRun;
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
};
