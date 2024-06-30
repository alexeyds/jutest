# Documentation

- [Core API](https://github.com/alexeyds/jutest/blob/master/docs/core-api.md)
- **Runtime API**
  - [Summary](https://github.com/alexeyds/jutest/blob/master/docs/runtime-api.md#summary)
  - [`initRuntime`](https://github.com/alexeyds/jutest/blob/master/docs/runtime-api.md#initruntimeruntimeconfig)
  - [`initCli`](https://github.com/alexeyds/jutest/blob/master/docs/runtime-api.md#initcli)
  - [Config params](https://github.com/alexeyds/jutest/blob/master/docs/runtime-api.md#config-params)
  - [`reporterPresets`](https://github.com/alexeyds/jutest/blob/master/docs/runtime-api.md#reporterpresets)
- [Using Preprocessors](https://github.com/alexeyds/jutest/blob/master/docs/preprocessors.md)
- [Reporters API](https://github.com/alexeyds/jutest/blob/master/docs/reporters-api.md)

# Summary

Runtime API provides the means for setting up custom command-line scripts that can be used in place of the default `jutest` command.

To get started:

- create a file to serve as an executable(typically `bin/test`)
- make sure it has correct permissions: `chmod +x bin/test`
- start with following contents and modify as necessary(i.e by adding [preprocessor register hooks](https://github.com/alexeyds/jutest/blob/master/docs/preprocessors.md)):

```js
#!/usr/bin/env node

const { initRuntime, initCLI } = require('jutest/runtime');

const cliParams = initCLI();

initRuntime({
  locationsToRun: ['tests'],
  jutestRunCommand: 'bin/test', // make reporters aware of the custom test command we're using
  // ... any other config params to set as defaults for the executable

  // make sure CLI params always overwrite the defaults
  ...cliParams.runtimeConfig,
});

```

# `initRuntime(runtimeConfig)`

Main function of the Runtime API. This will initiate the jutest runtime, load provided test file locations and run all the tests defined within those files.\
See [Config params](https://github.com/alexeyds/jutest/blob/master/docs/runtime-api.md#config-params) for the full list of the available options that this function accepts.

```js
initRuntime({
  locationsToRun: ['tests'],
  jutestRunCommand: 'yarn test',
  excludeTags: ['api'],
});
```

# `initCLI()`

Initiates jutest CLI API and parses current `argv` using yargs parser. This enables full support for jutest's default CLI Options.

This function returns an object with the following properties:

- `runtimeConfig` - Runtime Config params parsed from the `argv`. This object can be passed directly to [`initRuntime`](https://github.com/alexeyds/jutest/blob/master/docs/runtime-api.md#initruntimeruntimeconfig).
- `parsedArgv` - an object with every option received in `argv` as parsed by yargs. You can use it to extend the command's behavior.

```js
const { runtimeConfig, parsedArgv } = initCLI();
```

## Options

### `<locations>`

Everything non-option provided to the command is added to the [`locationsToRun`](https://github.com/alexeyds/jutest/blob/master/docs/runtime-api.md#locationstorun) array.

### `--help`

Alias: `-h`. Prints out the description for each supported option.

### `--version`

Alias: `-v`. Prints jutest's current version.

### `--seed`

Specifies the seed to use. Same as [`seed`](https://github.com/alexeyds/jutest/blob/master/docs/runtime-api.md#seed) config param.

### `--order`

Specifies the order in which to run tests. Same as [`order`](https://github.com/alexeyds/jutest/blob/master/docs/runtime-api.md#order) config param.

### `--tags`

Alias: `--onlyIncludeTags`. Only tests matching one of these tags will be included in the run. Same as [`onlyIncludeTags`](https://github.com/alexeyds/jutest/blob/master/docs/runtime-api.md#onlyincludetags) config param.

`--tags type=api` is parsed as `{ type: 'api' }`\
`--tags api` is parsed as `{ api: true }`

You can also specify multiple tags via `--tags type=api --tags api` which is converted into `{ api: true, type: 'api' }`

### `--excludeTags`

Test matching one of those tags are excluded from the run. The exclusion is overridden by `--tags`. Same as [`excludeTags`](https://github.com/alexeyds/jutest/blob/master/docs/runtime-api.md#excludetags) config param.

Uses the same parsing logic as `--tags`.

# Config params

```js
const defaultParams = {
  locationsToRun: [],
  includeTestFilePatterns: ["*.(test|spec).*"],
  excludeTestFilePatterns: [],
  excludeTestDirectoryPaths: ['node_modules'],
  seed: randomSeed(),
  order: 'random',
  stdout: process.stderr.write,
  trackedSourcePaths: ['./'],
  ignoredSourcePaths: ['node_modules'],
  jutestRunCommand: 'jutest',
  reporters: reporterPresets.progressReporterPreset,
  onlyIncludeTags: {},
  excludeTags: {},
};
```

## `locationsToRun`

Default: `[]`. Test file locations to load and run. A location can either be:

- a directory: `'tests'`
- a file: `'tests/my_test.test.js'`
- a file with a line number: `'tests/my_test.test.js:45'`
- a file with multiple line numbers: `'tests/my_test.test.js:34:45'` 

If a line number is specified, only test or suite defined on that exact line will be run.\
For example, given a file named `calculator.test.js`:

![image](https://github.com/alexeyds/jutest/assets/13683731/b1b20150-5ec6-4735-a1cb-6c50d1924f5c)

`calculator.test.js:5` will run the `"Calculator#add"` suite and ignore everything else.\
`calculator.test.js:15` will run the `"Calculator#subtract works with negative numbers"` test and ignore everything else.\
`calculator.test.js:4:10` will run both `"Calculator#add"` and `"Calculator#subtract"` suites.\
`calculator.test.js:6` **will not run anything** as there is no spec defined on that exact line.

## includeTestFilePatterns

Default: `["*.(test|spec).*"]`. A list of glob patterns to be matched against potential test file's name to determine whether it's a test file or not. Uses micromatch.\
Note that matching is done against the base name of the file, excluding directory.

Any file provided directly to `locationsToRun` will be included in the test run even if it doesn't match any of these patterns.

## excludeTestFilePatterns

Default: `[]`. A list of glob patterns to be matched against test file's name. All matching files will be excluded from the run.

Uses the same matching algorithm as `includeTestFilePatterns`

## excludeTestDirectoryPaths

Default: `['node_modules']`. A list of directories to exclude from the test run. Note that these must be directory *paths*, not glob patterns.

Paths are resolved to the current working directory, i.e:

- `tests/node_modules` resolves to `${cwd}/tests/node_modules`
- `/node_modules` resolves to `/node_modules`

## seed

Default: `<random seed>`. A number to be used as the seed to randomly order tests.

Only applicable if `order` is `random`.

## order

Default: `'random'`. Test ordering strategy to use during the run. Can be either `'random'` or `'defined'`.

Random ordering is always recommended as ideally your tests should not depend on the execution order.

## stdout

Default: `process.stderr.write`. A stdout function that will be used by jutest to print out various information, i.e reporters data.

## trackedSourcePaths

Default: `['./']`. Source paths to track. Used by some reporters while searching for the failed line in the source code.

Paths are resolved to the current working directory.

## ignoredSourcePaths

Default: `['node_modules']`. Source paths to ignore. Used by some reporters while searching for the failed line in the source code.

Paths are resolved to the current working directory.

## jutestRunCommand

Default: `'jutest'`. Jutest command that you're using to run tests. Needed by some reporters to print out accurate rerun information.

## reporters

Default: `reporterPresets.progressReporterPreset`. An array of reporters to use during this run. See [Reporters API](https://github.com/alexeyds/jutest/blob/master/docs/reporters-api.md).

## onlyIncludeTags

Default: `{}`. A list of tags to include. Only tests matching one of these tags will be run, all others will be skipped.

This has priority over `excludeTags` so only one option can be specified at the time.

Given this test file:

```js
jutest('Code', s => {
  s.test('does api stuff', { api: true }, t => {
    // ...
  });

  s.test('does file stuff', { type: 'file' }, t => {
    // ...
  });
});

```

- Specifying `includeTags: { api: true }` will only run the `"Code does api stuff"` test.
- specifying `includeTags: { type: 'file' }` will only run `"Code does file stuff"` test.
- Specifying `includeTags: { api: true, type: 'file' }` will run both tests.

## excludeTags

Default: `{}`. A list of tags to exclude. Any tests matching one of those tags will be omitted from the run.

Specifying `onlyIncludeTags` overrides this option.

# `reporterPresets`

Default reporter presets. See [Reporter API](https://github.com/alexeyds/jutest/blob/master/docs/reporters-api.md) for more info on how to use reporters.

```js
const { initRuntime, reporterPresets } = require('jutest/runtime');

initRuntime({
  reporterPresets: reporterPresets.progressReporterPreset,
});
```


## `reporterPresets.progressReporterPreset`

Defined as:

```js
[
  ProgressReporter,
  FailedTestsReporter,
  SummaryReporter,
  RerunnableLocationsReporter,
];

```
