# Jutest
![image](https://github.com/alexeyds/jutest/assets/13683731/54685679-8509-4862-9e30-c55f5fc2f3ba)

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

Jutest's Core API has 4 basic concepts:

1. test: a named function that can be used to execute a piece of code and run assertions on the results.
2. suite: (or a "describe" block) used for grouping related tests and setups under a shared name.
3. setup/teardown: a function that will be executed before/after each test in this suite. Setups also allow building and passing extra data(assigns) to tests or other setups.
4. tags: while setups can be used to pass data to the test, tags can be used to pass data from the test to the setups. During the test run, tests can also be filtered by their tags.

Jutest comes with full async support and every suite, test or setup can be defined as an async function.

## Basic example

```js
import { jutest } from "jutest";
import { Calculator } from "calculator";

jutest("Calculator", s => {
  s.describe("add()", s => {
    s.test("adds two numbers", t => {
      const calculator = new Calculator();
      t.equal(calculator.add(1, 2), 3);
    });
  });
});

```

## With setups

```js
import { jutest } from "jutest";
import { UsersClient } from "api/users-client";

jutest("UsersClient", s => {
  s.setup(() => {
    return { client: new UsersClient() };
  });

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

## With tags

```js
import { jutest } from "jutest";
import { writeFileSync } from "fs";

jutest("tags", s => {
  s.setup((, tags) => {
    if (tags.type === 'file') {
      // "name" is a special tag and always contains the full name of the current test
      const fileName = tags.name.split(' ').join('-');
      const filePath = `tmp/${fileName}`;
      writeFileSync(filePath, '');

      return { filePath };
    }
  });

  s.test("file test", { type: 'file' }, (t, { filePath }) => {
    t.includes(filePath, "tags-file-test");
  });

  s.test("normal test", (t, { filePath }) => {
    t.equal(filePath, undefined);
  });
});
```

## Extending jutest

If multiple test files across your project require similar testing setup, you can use `jutest.configureNewInstance` to spawn a new jutest instance encapsulating this setup. This new instance can now be used to define tests exactly like the original `jutest`:

```js
import { jutest } from "jutest";

const apiJutest = jutest.configureNewInstance(s => {
  s.addName('[API]');
  s.addTags({ api: true });

  s.setup(() => {
    return { apiMock: createApiMock() };
  });

  s.assertAfterTest((t, { apiMock }) => {
    t.equal(apiMock.allMocksConsumed, true);
  });
});

apiJutest('my api test', s => {
  s.test('has apiMock assign', (t, { apiMock }) => {
    t.assert(apiMock);
  });
});
```

# Running tests

In the most basic scenario, the default `jutest` binary can be used to run tests(assuming `tests/` directory houses the test files):

```
yarn jutest tests
```
or

```
npx jutest tests
```

Most modern JavaScript projects rely on the code pre-processors(such as TypeScript or Babel) and likely will not work without them. **By design jutest does not include any pre-processor configuration so setting those up for your code is up to you.** You can consult Pre-Processor Configuration section of the docs for examples.

# Configuration

There are two main ways of configuring jutest's runtime: custom runtime executable and/or a config file.

### Custom runtime executable

Jutest provides Runtime API for creating custom executable scripts. This is the recommended way of running tests due to its flexibility.

To start, create a file to serve as an executable, such as `bin/test`:

```js
#!/usr/bin/env node

const { initRuntime, initCLI, loadConfigFile } = require('jutest/runtime');

const cliParams = initCLI();

initRuntime({
  locationsToRun: ['tests'],
  jutestRunCommand: 'bin/test', // make reporters aware of the custom test command we're using
  // ... any other config params to set as defaults for the executable
  ...loadConfigFile(cliParams.configFilePath),
  ...cliParams.runtimeConfig,
});

```

Make it executable with `chmod +x bin/test` and you're good to go.\
Now the custom `bin/test` command can be used in place of `jutest`. This command also supports the entire CLI API of the original.

You can also add it to the `package.json` to use `npm test` or `yarn test` instead of `bin/test`:

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
