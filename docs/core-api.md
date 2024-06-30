# Documentation

- **Core API**
  - [Suite API](https://github.com/alexeyds/jutest/blob/master/docs/core-api.md#suite-api)
  - [Using tags](https://github.com/alexeyds/jutest/blob/master/docs/core-api.md#using-tags)
  - [`jutest.configureNewInstance`](https://github.com/alexeyds/jutest/blob/master/docs/core-api.md#jutestconfigurenewinstancefn)
  - [Assertions API](https://github.com/alexeyds/jutest/blob/master/docs/core-api.md#assertions-api)
- [Runtime API](https://github.com/alexeyds/jutest/blob/master/docs/runtime-api.md)
- [Using Preprocessors](https://github.com/alexeyds/jutest/blob/master/docs/preprocessors.md)
- [Reporters API](https://github.com/alexeyds/jutest/blob/master/docs/reporters-api.md)

# Suite API

Contains everything required to define and control suites, tests and test setups.

## `jutest`

The starting point of any test file. By itself it can be used to create a regular `describe` block and comes with the following properties attached:

- `jutest.describe` - same as `suiteApi.describe`, alias for `jutest`
- `jutest.xdescribe` - same as `suiteApi.xdescribe`
- `jutest.test` - same as `suiteApi.test`
- `jutest.xtest` - same as `suiteApi.xtest`
- `jutest.configureNewInstance` - spawns a new configurable jutest instance. See [`jutest.configureNewInstance`](https://github.com/alexeyds/jutest/blob/master/docs/core-api.md#jutestconfigurenewinstancefn) for more info.

```js
import { jutest } from 'jutest';

jutest('a describe block', s => {
  s.test('checks if 1 === 1', t => {
    t.equal(1, 1);
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

`fn` will be called with `fn(suiteApi)` and `suiteApi` can then be used to define tests and suites nested within this one.

Async suite definitions are also supported and `fn` can return a promise to be awaited upon.

An optional second argument `tags` can be provided to tag all the tests within this suite. See [Using tags](https://github.com/alexeyds/jutest/blob/master/docs/core-api.md#using-tags) for a detailed description.

```js
jutest('SomeCode', s => {
  s.describe('someMethod', s => {
    s.test('does something', t => {
      // ...
    });
  });

  s.describe('someOtherMethod', s => {
    s.test('does something else', t => {
      // ...
    });
  });
});

```

## `suiteApi.xdescribe(name, [tags], fn)`

Same as `suiteApi.describe` but all the tests defined within this suite will be marked as skipped.

```js
jutest('SomeCode', s => {
  s.describe('a suite', s => {
    s.test('will be run', t => {
      // ...
    });
  });

  s.xdescribe('a skipped suite', s => {
    s.test('will not be run', t => {
      // ...
    });
  })
});

```

## `suiteApi.test(name, [tags], fn)`

Defines a new test case with the given `name`.

`fn` represents the test body and will be called with `fn(assertions, assigns)`.\
See [Assertions API](https://github.com/alexeyds/jutest/blob/master/docs/core-api.md#assertions-api) for the list of available assertions and [`suiteApi.setup`](https://github.com/alexeyds/jutest/blob/master/docs/core-api.md#suiteapisetupfn) to learn about the `assigns` object.

Async tests are also supported and `fn` can return a promise to be awaited upon.

An optional second argument `tags` can be provided to tag the defined test. See [Using tags](https://github.com/alexeyds/jutest/blob/master/docs/core-api.md#using-tags) for a detailed description.


```js
jutest('SomeCode', s => {
  s.test('does a useless equality check', t => {
    t.equal('foo', 'foo');
  });

  s.test('checks assigns', (t, assigns) => {
    t.same(assigns, {});
  });
});

```

## `suiteApi.xtest(name, [tags], fn)`

Same as `suiteApi.test` but marks the defined test as skipped.

```js
jutest('SomeCode', s => {
  s.test('will not be skipped', t => {
    // ...
  });

  s.xtest('will be skipped', t => {
    // ...
  });
});

```

## `suiteApi.setup(fn)`

Defines a setup script that will be run before each test within this suite.

`fn` will be called with `fn(assigns, tags)` and can also be async.

`assigns` starts as an empty object but any plain object returned by the setup `fn` will be merged into the current `assigns` and passed down to the test or to the next setup function.

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

`fn` will be called with `fn(assigns, tags)` and can also be async.

```js
jutest('ApiClient', s => {
  s.setup(() => {
    return { mock: prepareMock() };
  });

  s.teardown(({ mock }) => {
    mock.reset();
  });

  s.test('uses the mock', (t, { mock }) => {
    mock.use();
  });
});
```

## `suiteApi.assertBeforeTest(fn)`

Defines a set of extra assertions that will be executed before each test in this suite.

`fn` will be called with `fn(assertions, assigns)` and can also be async.

`fn` is treated as an extension of the test's body: if any assertions fail or if `fn` throws an error, the current test will also be marked as failed


```js
jutest('Database', s => {
  s.assertBeforeTest((t) => {
    t.equal(globalDatabase.isInCleanState, true);
  });

  s.test('does something with the database', t => {
    globalDatabase.fetchRecord();
  });
});
```

## `suiteApi.assertAfterTest(fn)`

Defines a set of extra assertions that will be executed after test in this suite.

`fn` will be called with `fn(assertions, assigns)` and can also be async.

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

  s.test('uses the mock', (t, { mock }) => {
    mock.consume();
  });
});
```

## `suiteApi.addName(name)`

Adds an extra name to the suite.

The main purpose of this function is to assign names to new jutest instances created by [`jutest.configureNewInstance`](https://github.com/alexeyds/jutest/blob/master/docs/core-api.md#jutestconfigurenewinstancefn) but it can also be used within regular suites.

```js
// Final suite name will be "Suite with extra stuff"
jutest('Suite', s => {
  s.addName('with extra stuff');
});
```

## `suiteApi.addTags(tags)`

Adds extra tags to the suite.

The main purpose of this function is to assign tags to new jutest instances created via [`jutest.configureNewInstance`](https://github.com/alexeyds/jutest/blob/master/docs/core-api.md#jutestconfigurenewinstancefn) but it can also be used within regular suites.

```js
jutest('Tags', s => {
  s.describe("setting tags via a method", s => {
    s.addTags({ type: 'api' });

    s.setup((_assigns, tags) => {
      console.log(tags.type); //=> "api"
    });
  });

  s.describe("setting tags via an argument", { type: 'db' }, s => {
    s.setup((_assigns, tags) => {
      console.log(tags.type); //=> "db"
    });
  });
});

```

# Using tags

Every test and suite can be tagged by providing an optional `tags` object to the `suiteApi.test` or `suiteApi.describe`.

Tagging a suite will also apply the tags to all the tests and suites nested within it.\
If a nested test/suite has its own tags, two sets of tags will be merged together with own tags given a priority.

Tests can be filtered by tags during the test run, for example:
- `jutest --tags type=api` will only run tests with `{ type: 'api' }` tag.
- `jutest --tags api` will only run tests tagged `{ api: true }`.

See [Runtime API](https://github.com/alexeyds/jutest/blob/master/docs/runtime-api.md#--tags) for more details.

Tags also enable test->setup communication, for example you can run different setup scripts based on the test's tag:

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
- `name` - a name of the current test. This tag cannot be overwritten.

# `jutest.configureNewInstance(fn)`

Creates a new `jutest` instance without modifying the current one.\
Useful for cases when different tests across the project share a certain reusable setup.

`fn` will be called with `fn(jutestBuilder)` where `jutestBuilder` is an object the includes the following properties from the `suiteApi`:

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

Checks if `actual` is equal to `expected` using [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) comparison.\
To compare object structure, use `t.same`

```js
t.equal(1, 1) //=> passes
t.equal('foo', 'bar') //=> fails
t.equal([], []) // => fails
```

## `t.notEqual(actual, expected)`

An opposite of `t.equal`

## `t.same(actual, expected)`

Checks if `actual` structurally matches `expected` using [`deep-equal`](https://github.com/inspect-js/node-deep-equal) comparison.

```js
t.same(1, 1) // => passes
t.same([], []) // => passes
t.same({ a: 1 }, { a: 2 }) // => fails
```

## `t.notSame(actual, expected)`

An opposite of `t.same`

## `t.match(actual, expected)`

Checks if `actual` string matches `expected` using [`RegExp.test`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/test) comparison.

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

Checks if `promise` will be rejected with an error matching `matcher`. Same matching algorithm is used as in [`t.throws`](https://github.com/alexeyds/jutest/blob/master/docs/core-api.md#tthrowsfn-matcher)

This is an async assertion so it must be awaited upon.

```js
await t.async.rejects(Promise.reject('foobar'), 'foo') //=> passes
await t.async.rejects(Promise.resolve(), /foo/) //=> fails
await t.async.rejects(Promise.reject(new Error()), /test/) //=> fails
```

## `t.async.passesEventually(fn, { [timeout]=5000, [interval]=0 })`

Checks if `fn` will stops throwing errors/rejecting after a given `timeout`(ms).\
A custom `interval` can also be specified to modify how often `fn` should be called.

This is an async assertion so it must be awaited upon.

```js
await t.async.passesEventually(() => {}) //=> passes
await t.async.passesEventually(() => Promise.reject()) //=> fails
await t.async.passesEventually(() => { throw '123' }) //=> fails
```

## AssertionFailedError

Jutest assertions are just functions so they're really easy to create: any function that can throw `AssertionFailedError` is an assertion.

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
