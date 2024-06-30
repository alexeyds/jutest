# Documentation

# Summary

Jutest does not make any assumptions about your project's code: it simply loads the discovered test files using either `require` or `import` and runs registered tests. This might work fine for some, but most modern JavaScript projects use syntax that the native environment(i.e node) simply does not support, such as TypeScript or JSX.

To run this non-native code, projects have to utilize preprocessors that convert it into more traditional JavaScript either by going through each file and converting all the code into a separate static bundle or by utilizing `require` hooks that allow converting code on the fly as it's being loaded. For tests you usually want the latter and this is the approach that this page describes.

Every modern JavaScript preprocessors provides a require hook that you can register before requiring any of the project's code. In jutest you can set it up using one of the two approaches:

1. (Recommended) By registering the hook in your custom runtime executable(make sure the hook is registered before the `initCli` call)
2. By creating a `config.jutest.js` file in your project's root directory and registering the hook there. This file is be loaded by jutest before any of your project's code.

Below you'll find some examples describing specific preprocessors and their setup.

# Babel

You can use `@babel/register` module to process your code with Babel. Simply install it and register the hook:

```js
#!/usr/bin/env node

require('@babel/register')({
  // You might need to specify file extensions that your project uses
  // if they're different from node's defaults
  extensions: [".ts", ".tsx", ".js", ".jsx", ".es", ".es6", ".mjs"]
});

const { initRuntime, initCLI, loadConfigFile } = require('jutest/runtime');
//... init jutest runtime

```

# Esbuild

You can use `esbuild-register` module to process your code with esbuild. Simply install it and register the hook:

```js
#!/usr/bin/env node

const { register } = require('esbuild-register/dist/node');
const { config } = require('path-to-my-esbuild-config');
register(config);

const { initRuntime, initCLI, loadConfigFile } = require('jutest/runtime');
//... init jutest runtime

```

# Script engines

Another benefit of creating a custom runtime executable is that instead of node you can run the executable with any other script engine, such as `ts-node`:

```js
#!/usr/bin/env ts-node

const { initRuntime, initCLI, loadConfigFile } = require('jutest/runtime');
//... init jutest runtime

```
