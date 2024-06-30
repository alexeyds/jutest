#!/usr/bin/env node

let runtime = require('jutest/runtime');
let cliParams = runtime.initCLI();

runtime.initRuntime(cliParams.runtimeConfig);
