#!/usr/bin/env node

let runtime = require('../dist/runtime');
let cliParams = runtime.initCLI();

runtime.initRuntime(Object.assign({},
  runtime.loadConfigFile(cliParams.configFilePath),
  cliParams.runtimeConfig,
));
