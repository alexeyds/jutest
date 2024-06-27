# Documentation

# Suite API

Contains everything required to define and control suites, tests and test setups.

## `jutest`

The starting point of any test file. By itself it can be used to create a regular `describe` block and comes with the following properties attached:

- `jutest.describe` - same as `suiteApi.describe`, alias for `jutest`
- `jutest.xdescribe` - same as `suiteApi.xdescribe`
- `jutest.test` - same as `suiteApi.test`
- `jutest.xtest` - same as `suiteApi.xtest`
- `jutest.configureNewInstance` - spawns a new configurable jutest instance. See `jutest.configureNewInstance` for more info.

```js
import { jutest } from 'jutest';

jutest('a describe block', s => {
  s.test('checks if 1 === 2', t => {
    t.equal(1, 2);
  });
});

jutest.describe('another describe block', s => {
  // ...
});

jutes.test('a standalone test', t => {
  t.assert(true);
});

```

## `suiteApi.describe(name, [tags], fn)`

Defines a new test suite with the given `name`.

`fn` will be called with a new `suiteApi` object which can then be used to define tests and suites nested within this one.

An optional second argument `tags` can be provided to tag all the tests within this suite. See Using tags for a detailed description.

## `suiteApi.xdescribe(name, [tags], fn)`

Same as `suiteApi.describe` but all the tests defined within this suite will be marked as skipped.

## `suiteApi.test(name, [tags], fn)`

Defines a new test case with the given `name`.

`fn` represents the test body and will be called with `fn(assertions, assigns)`.\
See Assertions API for the list of available assertions and `suiteApi.setup` to learn about the `assigns` object.

An optional second argument `tags` can be provided to tag the defined test. See Using tags for a detailed description.

## `suiteApi.xtest(name, [tags], fn)`

Same as `suiteApi.test` but marks the defined test as skipped.

## `suiteApi.setup(fn)`

Defines a setup script that will be run before each test within this suite.

`fn` will be called with `fn(assigns, tags)`.

`assigns` starts as an empty object but any plain object returned by the setup `fn` will be merged into the current `assigns` and passed down to the test or to the next setup script.

```js
jutest('ApiClient', s => {
  s.setup(() => {
    const client = new ApiClient();
    return { client };
  });

  s.setup(async ({ client }) => {
    const user = await client.fetchUser('john');
    return { user };
  });

  s.test('has user and client in the assigns', (t, { client, user }) => {
    t.assert(client);
    t.assert(user);
  });
});
```

## `suiteApi.teardown(fn)`

Defines a teardown script that will be run after each test within this suite.

`fn` will be called with `fn(assigns, tags)`.

## `suiteApi.assertBeforeTest(fn)`

Defines a set of extra assertions that will be executed before each test in this suite.

`fn` will be called with `fn(assertions, assigns)`.

`fn` is treated as an extension of the test's body: if any assertions fail or if `fn` throws an error, the current test will also be marked as failed

## `suiteApi.assertAfterTest(fn)`

Defines a set of extra assertions that will be executed after test in this suite.

`fn` will be called with `fn(assertions, assigns)`.

`fn` is treated as an extension of the test's body: if any assertions fail or if `fn` throws an error, the current test will also be marked as failed


```js
jutest('API mock', s => {
  s.setup(() => {
    const mock = new ApiMock();
    return { mock };
  });

  s.assertAfterTest((t, { mock }) => {
    t.assert(mock.validateMocksConsumed())
  });

  s.test('provides mocks for the test', (t, { mock }) => {
    // ...
  });
});
```

## `suiteApi.addName(name)`

Adds an extra name to the suite.

The main purpose of this function is to add scope names to new jutest instances created by `jutest.configureNewInstance` but it can also be used within regular suites.

## `suiteApi.addTags(tags)`

Adds extra tags to the suite.

The main purpose of this function is to add tags to new jutest instances created via `jutest.configureNewInstance` but it can also be used within regular suites.

# Using tags

Every test and suite can be tagged by providing an optional `tags` object to the `suiteApi.test` or `suiteApi.describe`.

Tagging a suite will also apply the tags to all the tests and suites nested within it.\
If nested test/suite has its own tags, two sets of tags will be merged together with own tags given a priority.

Tags serve two primary purposes:
- Allow filtering tests by type during the test run(see Runtime API)
- Enable test->setup communication, for example to run different setup scripts based on the test's type:

```js
jutest('Tagged tests', s => {
  s.setup((_assigns, tags) => {
    if (tags.api) {
      return { apiClient: new ApiClient() };
    } else if (tags.type === 'file') {
      return { tmpFile: createTmpFile() };
    }
  });

  s.test('API test', { api: true }, (t, { apiClient, tmpFile }) => {
    t.assert(apiClient);
    t.equal(tmpFile, undefined);
  });

  s.test("file test", { type: 'file' }, (t, { apiClient, tmpFile }) => {
    t.assert(tmpFile);
    t.equal(apiClient, undefined);
  });
});
```

## Special tags

Following tags have special meaning in jutest:

- `timeout` - defines a timeout time (ms) for the given test. 5000 by default.

# `jutest.configureNewInstance(fn)`

Creates a new `jutest` instance without modifying the old one.\
Useful for cases when different tests across the project share a certain reusable setup.

`fn` will be called with `fn(jutestBuilder)` where `jutestBuilder` is an object sharing the following properties from the `suiteApi`:

- `assertBeforeTest`
- `assertAfterTest`
- `setup`
- `teardown`
- `addName`
- `addTags`

It's also possible to chain configurations to inherit all of the setups from another `jutest` instance, exactly like defining a nested test suite:

```js
import { jutest } from "jutest";

const apiJutest = jutest.configureNewInstance(s => {
  s.addName('[API]');
  s.addTags({ api: true });

  s.setup(() => {
    return { apiClient: new ApiClientMock() };
  });

  s.assertAfterTest((t, { apiClient }) => {
    t.equal(apiClient.allMocksConsumed, true);
  });
});

const extraApiJutest = apiJutest.configureNewInstance(s => {
  s.addName('[EXTRA]');

  s.setup(({ apiClient }) => {
    apiClient.doExtraStuff();
  });
});

// apiJutest and extraApiJutest can now be imported by any test file and used in place of the regular jutest
export { apiJutest, extraApiJutest };

```

# Assertions API

A list of assertions that jutest provides by default. You can also create your custom assertions with the use of `AssertionFailedError`.

## `t.assert(actual)`

Checks if `actual` is truthy

```js
t.assert(true) //=> passes
t.assert('') //=> fails
t.assert(null) //=> fails
```

## `t.refute(actual)`

An opposite of `t.assert`.

## `t.equal(actual, expected)`

Checks if `actual` is equal to `expected` using `Object.is` comparison.\
To compare object structure, use `t.same`

```js
t.equal(1, 1) //=> passes
t.equal('foo', 'bar') //=> fails
t.equal([], []) // => fails
```

## `t.notEqual(actual, expected)`

An opposite of `t.equal`

## `t.same(actual, expected)`

Checks if `actual` structurally matches `expected` using `deepEqual` comparison.

```js
t.same(1, 1) // => passes
t.same([], []) // => passes
t.same({ a: 1 }, { a: 2 }) // => fails
```

## `t.notSame(actual, expected)`

An opposite of `t.same`

## `t.match(actual, expected)`

Checks if `actual` string matches `expected` using `RegExp.test` comparison.

```js
t.match('foo', 'fo') // => passes
t.match('foo', /f.*/) // => passes
t.match('foo', /bar/) // => fails
```

## `t.doesNotMatch(actual, expected)`

An opposite of `t.match`

## `t.throws(fn, matcher)`

Checks whether `fn` throws an expression that matches `matcher`.

```js
t.throws(() => { throw 'foobar' }, 'foo') //=> passes
t.throws(() => { throw new Error('test') }, Error) //=> passes
t.throws(() => { throw new Error('test') }, /test/) //=> passes
t.throws(() => {}, Error) //=> fails
t.throws(() => { throw new Error('bar') }, /foo/) //=> fails
```

## `t.includes(actual, expected)`

Checks whether `actual.includes(expected)`.

```js
t.includes([1, 2, 3], 2) //=> passes
t.includes('foobar', 'foo') //=> passes
t.includes('foo', 'bar') //=> fails
```

## `t.doesNotInclude(actual, expected)`

An opposite of `t.includes`.

## `t.fail(message)`

Fails the test with the given message.

## `t.async.rejects(promise, matcher)`

Checks if `promise` will be rejected with an error matching `matcher`. Same matching algorithm is used as in `t.throws`

This is an async assertion so it must be awaited upon.

```js
await t.async.rejects(Promise.reject('foobar'), 'foo') //=> passes
await t.async.rejects(Promise.resolve(), /foo/) //=> fails
await t.async.rejects(Promise.reject(new Error()), /test/) //=> fails
```

## `t.async.passesEventually(fn, { [timeout]=5000, [interval]=0 })`

Checks if `fn` will stops throwing errors/rejecting after a given `timeout`(ms).\
A custom `interval` can also be specified to modify how often this function should be called.

This is an async assertion so it must be awaited upon.

```js
await t.async.passesEventually(() => {}) //=> passes
await t.async.passesEventually(() => Promise.reject()) //=> fails
await t.async.passesEventually(() => { throw '123' }) //=> fails
```

## AssertionFailedError

Jutest assertions are just functions so they're really easy to create: any function that can throw `AssertionFailedError` is an assertion!

Here is an example of a creating a custom assertion and adding it to the list of existing assertions.

```js
import { jutest, AssertionFailedError } from "jutest";

function looselyEqual(actual, expected) {
  if (actual != expected) {
    throw new AssertionFailedError(`expect ${expected} to equal ${actual}`);
  }
}

jutest("looselyEqual", s => {
  s.assertBeforeTest(t => {
    t.looselyEqual = looselyEqual;
  });

  s.test('compares two numbers', (t) => {
    t.looselyEqual(1, 1);
  });
});
```
