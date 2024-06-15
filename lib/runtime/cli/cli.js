import { parseArgv } from "./parse-argv";

export function initCLI() {
  return parseArgv(process.argv);
}
