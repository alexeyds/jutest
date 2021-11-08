# jutest
JavaScript Unit-Testing framework

# Installation

```yarn add jutest --dev```

```npm install jutest --save-dev```

# Description

Jutest is a dead-simple JavaScript unit-testing framework, inspired by [tape](https://github.com/substack/tape), but with rspec-like user-friendliness and prettiness in mind. It offers full async support, complete control over your tests and how they're run, and an intuitive and simple assertions library. 

# Basic configuration

Jutest aims to be as much magic-free as possible, giving you full control over its setup and doing only the thing it was intended for: executing tests. For basic configuration you'll have to create an executable file(e.g `bin/jutest`):

```js
#!/usr/bin/env node

// Not necessary if you dont use any env checks in your code
process.env.BABEL_ENV = 'test';
process.env.NODE_ENV = 'test';

// Make sure rejections don't fail silently in old node versions
process.on('unhandledRejection', err => {
  throw err;
});

// Configure babel if needed(make sure @babel/register package is installed), otherwise remove this line
require('@babel/register');

require('jutest').autoRun();

```

Don't forget to make it executable: `chmod +x ./bin/jutest` and you're set to go! By default, it will look for tests in either your project's root `test` directory(files matching `/**/*_test.*` glob pattern) or in the provided directory/file: `./bin/jutest test/calculator` See `justest.autoRun()` for more configuration options.


## `jutest.autoRun([config])`

Loads and executes all found tests in your project. Accepts configuration object with following defaults:

```js
{
  // Array of paths to test files needed to be executed.
  // Can be a glob patter or a simple path.
  // If empty, defaultTestDir is used to look for test files instead
  paths: process.argv.slice(2),
  // Default directory to search for tests
  defaultTestDir: "test",
  // Any file matching this glob will be considered a test
  // and loaded if found within paths or defaultTestDir
  testFilesGlob: "/**/*_test.*",
  // Directory to look for source files(used for better error reporting)
  sourceDir: process.cwd(),
  // Directories to exclude from source files(used for better error reporting)
  excludeSourceDirs: ['/node_modules']
}
```


# Usage

A simple test file would look like this:

```js
import jutest from "jutest";
import Calculator from "calculator";

jutest("Calculator", s => {
  s.setup(() => {
    return { calculator: new Calculator() };
  });

  s.test("can be initialized", (t, {calculator}) => {
    t.assert(calculator);
  });

  s.describe("#add", s => {
    s.test("adds together two numbers", (t, {calculator}) => {
      t.equal(calculator.add(1, 2), 3);
    });
  });
});

```

`s.describe(name, blockBody)` blocks are completely optional and their main purpose is to share a name between a group of tests and/or to share some isolated setups within this group. They can be nested at any depth, *however it's strongly recommended that you never nest describe blocks within each other more than one level deep, since it introduces too much complexity and readability issues into your tests.*

The `s.test(name, testBody)` function creates a test block and calls your `testBody` with an assertions object(`t`) and an assignments setup object. See [assertions](#assertions) and [assignments setup](#test-setup-and-assignments-context) respectively for more info.

# Assertions

Jutest provides a powerful assertions library that can be easily extended upon(after all, all of the assertions are just simple functions!):

### `t.equal(a, b)`

Checks for strict/reference equality using `Object.is`. For structure equality checks(like comparing objects) see `t.same(a, b)`

### `t.notEqual(a, b)`

Negated `t.equal`

### `t.same(a, b)`

Checks for structural or "conceptual" equality between values using [is-equal](https://www.npmjs.com/package/is-equal). Use this to compare two objects' inner structures

### `t.notSame(a, b)`

Negated `t.same`

### `t.assert(value)`

Asserts that value is not falsy(e.g not false, undefined, null, zero or empty string)

### `t.refute(value)`

Asserts that value is falsy(negated `t.assert`)

### `t.match(string, regex)`

Matches a string against a regular expression

### `t.doesNotMatch(string, regex)`

Negated `t.match`

### `t.fail(message)`

Fails the test with provided message

### `t.throws(func, matcher)`

Asserts that given function throws a matching error. `matcher` can be a string(to match error's name or message), a regular expression or error's class. Example:

```
t.throws(() => [].missingMethod(), "not a function");
t.throws(() => [].missingMethod(), "TypeError");
```

# Test setup and assignments context

## `s.setup(setupBody)`

Use this function within a `describe` or `jutest` block in order to run configuration code needed for multiple tests or to share some context(assignments) between tests. Any object returned from this function will be merged with previous assignments and then passed down to every test within the scope.

## `s.teardown(teardownBody)`

Executes a teardown function after each test within the scope.

# Global setup

Many projects require application-wide setup/teardown logic that must be run after each test, such as unmounting components and clearing stored state in a React app. Jutest provides an assortment of global hooks to achieve just that. Notice, that these functions are *global*, which means they apply to each and every test and should be required only once in your application. To achieve this, you could either modify your `bin/jutest` executable or re-export jutest after configuring it like so:

```js
// test/my_custom_jutest.js
import jutest from "jutest";
import { freezeTime } from "support/timers";
import { unmountRenderedHooks, unmountRenderedComponents } from 'support/react_renderer';

jutest.setup(() => {
  let fakeClock = freezeTime();
  return { fakeClock };
})

jutest.teardown(async () => {
  await unmountRenderedComponents();
  await unmountRenderedHooks();
  localStorage.clear();
  sessionStorage.clear();
});

export default jutest;
```

and then simply use this file in place of regular jutest in your tests:

```js
import jutest from "test/my_custom_jutest";

jutest("something", s => {
  // ...
});
```


## `jutest.setup(setupBody)`

Runs a setup function between each test and optionally updates assigns objects. Behaves just like `s.setup()` but applies to *every* test in your application, and not just to a single scope.

## `jutest.teardown(teardownBody)`

Runs a clean up function after each test. Behaves just like `s.teardown()` but applies to *every* test in your application, and not just to a single scope.

## License
MIT