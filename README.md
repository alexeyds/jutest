# Jutest
Jutest is a JavaScript unit testing library inspired by ExUnit and RSpec. It's:

- **Focused**: the sole goal of this library is to provide an API for defining and running unit tests. Everything else is up to you.
- **Simple**: no magic, no globals, no convoluted BDD syntax. Just plain old JavaScript that's easy to compose and reuse.
- **Test-first**: treats tests as first-class citizens of the codebase, not as standalone scripts.

# Installation

```
yarn add jutest --dev
```

or

```
npm install jutest --save-dev
```

# Defining tests

A typical test file in jutest looks something like this:

```js
// tests/api/users-client.test.js
import { jutest } from "jutest";
import { UsersClient } from "api/users-client";

jutest("UsersClient", s => {
  s.setup(() => {
    const client = new UsersClient();
    return { client };
  });

  s.test('has initial attributes', (t, { client }) => {
    t.equal(typeof client.findUser, 'function');
    t.same(client.results, []);
  })

  s.describe("findUser()", s => {
    s.test("fetches user by id", async (t, { client }) => {
      const result = await client.findUser(123);

      t.equal(result.success, true);
      t.equal(result.data.user.id, 123);
      t.equal(client.results.length, 1);
    });
  });
});
```

This example includes:
- A main `describe` block(aliased as `jutest`)
- A `setup` script to provide a fresh `client` assign to each of the tests within that suite
- Two `test` definitions, one of which is nested within another `describe` block
- A few basic assertions used within each of the tests

See Core API for more details on each of those and more.

# Running tests

In the most basic scenario, the default `jutest` binary can be used to run tests(assuming `tests/` directory houses the test files):

```
yarn jutest tests
```
or

```
npx jutest tests
```

However, most modern JavaScript projects rely on pre-processors(such as TypeScript or Babel) and likely will not work without them.

Since jutest is a testing library and by design it does not include any pre-processor configuration, setting it up for your code is up to you.

See Pre-Processor Configuration section of the docs for more details and examples.

# Configuration

There are two main ways of configuring jutest's runtime: custom runtime executable and/or a config file.

### Custom runtime executable

Jutest provides Runtime API for creating custom executable scripts. This is the recommended way of running tests as it's the most flexible.

To start, create a file to serve as an executable such as `bin/test`:

```js
#!/usr/bin/env node

const { initRuntime, initCLI, loadConfigFile } = require('../lib/runtime');

const cliParams = initCLI();

initRuntime({
  locationsToRun: ['tests'],
  jutestRunCommand: 'bin/test', // make reporters aware of the custom test command we're using
  // ... any other config params to set as defaults for the executable
  ...loadConfigFile(cliParams.configFilePath),
  ...cliParams.runtimeConfig,
});

```

Make it executable with `chmod +x bin/test` and you're good to go. Now the custom `bin/test` command can be used in place of `jutest`. This command also supports the entire CLI API of the original.

You can also add a `package.json` script to use `npm test` or `yarn test` instead of `bin/test`:

```json
{
  "scripts": {
    "test": "./bin/test"
  },
}
```

### Config file

Configuration params can also be specified via a jutest config file(`config.jutest.*` by default) with a default export:

```js
// config.jutest.js
module.exports = {
  locationsToRun: ['tests'],
  includeTestFilePatterns: ["*.test.js"],
  jutestRunCommand: 'npm test',
};
```

## Types

TypeScript definitions are included by default for every file and everything else is available via jutest/types:

```
import { RuntimeConfig, RunSummary, ReporterClass, ...etc } from "jutest/types";
```

## License
MIT
