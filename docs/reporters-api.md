# Documentation

# Custom reporters

A jutest reporter is any object that has the `initializeReporter(config, eventEmitter)` property. This function can either return nothing or a reporter instance for further use.

```js
export class MyCustomReporter {
  static initializeReporter(runtimeConfig, eventEmitter) {
    eventEmitter.on('test-end', testSummary => {
      // ...
    });

    return new MyCustomReporter();
  }

  finishReporting(runSummary) {
    // ...
  }
}

```

`initializeReporter` has the following call signature:

```ts
function initializeReporter(config: RuntimeConfig, eventEmitter: EventEmitter): Reporter | undefined;

interface Reporter {
  finishReporting?: (runSummary: RunSummary) => void;
}

```

## `RuntimeConfig`

Has the same attributes as Config params with a few differences:

- All paths such as `trackedSourcePaths` or `ignoredSourcePaths` are converted to absolute paths
- `locationsToRun` are converted into the list of file locations: `{ file: '/my/tests/foo.test.js', lineNumbers: [] }`.

## `EventEmitter`

An event emitter object that can be used to subscribe to vairous events:

```js
eventEmitter.on('test-start', testSummary => {});
eventEmitter.on('test-end', testSummary => {});

eventEmitter.on('file-start', recordFile);
eventEmitter.off('file-start', recordFile);
```

### File events

`file-start` and `file-end`, the callback for these events will receive a `file` string representing a path to file under test.

### Suite events

`suite-start` and `suite-end`, the callback for these events will receive a `suiteSummary` object:

```ts
interface SuiteSummary {
  type: 'suite';
  testsCount: number;
  name: string;
  ownName: string;
  contextId: number;
  parentContextIds: number[];
  definitionLocation: {
    file?: string;
    lineNumber?: number;
  };
}

```

### Test events

`test-start`, `test-end` and `test-skip`, the callback for these events will receive a `testSummary` object:

```ts
interface TestSummary {
  type: 'test';
  runTime: number;
  executionResult?: {
    status: 'passed' | 'failed' | 'skipped';
    error: any;
    skipReason: string | null;
  };
  name: string;
  ownName: string;
  contextId: number;
  parentContextIds: number[];
  definitionLocation: {
    file?: string;
    lineNumber?: number;
  };
}

```

## `Reporter.finishReporting(runSummary)`

An optional method that any reporter can implement to handle any reports that must wait until the end of the test run.\
`finishReporting` will be called on every reporter in order and awaited upon before proceeding to the next reporter.\

`finishReporting` receives a `runSummary` object:

```ts
interface RunSummary {
  success: boolean;
  runTime: number;
  exitReason: 'run-end' | 'interrupt';
  totalTestsCount: number;
  runTestsCount: number;
  passedTestsCount: number;
  skippedTestsCount: number;
  failedTestsCount: number;
  fileLoadTimes: Array<{
    file: string;
    loadTime: number;
  }>;
  testSummaries: Array<SuiteSummary | TestSummary>;
}

```

# Existing reporters

A list of reporters jutest provides by default.

## ProgressReporter

The "dot" reporter. As tests are executed it prints out a symbold representing the test status.

![image](https://github.com/alexeyds/jutest/assets/13683731/8219b875-1739-4cc0-872f-e1828e1aef1d)

## FailedTestsReporter

After the run, prints out the details on every failed/skipped test.

![image](https://github.com/alexeyds/jutest/assets/13683731/0423f18f-d203-4d2e-bb63-fdb39cd83b53)

## SummaryReporter

After the run, prints out the run time and test counts.

![image](https://github.com/alexeyds/jutest/assets/13683731/96b1dee1-c6d0-4f08-add8-098cca906bd0)

## RerunnableLocationsReporter

After the run, prints out rerun info for each failed test.

![image](https://github.com/alexeyds/jutest/assets/13683731/e056603b-75eb-48b0-85d2-a2e830e19ba2)
