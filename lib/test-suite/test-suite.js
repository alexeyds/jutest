import { reduceAsync } from "utils/async";
import { Test } from "test";

export class TestSuite {
  constructor(name, body, { context }) {
    context = context.copy();
    context.addName(name);

    this.tests = composeTests(body, context);
  }

  onTestsReady(callback) {
    this.tests.then(callback);
  }
}

async function composeTests(suiteBody, context) {
  let tests = [];
  let nestedSuites = [];

  await suiteBody({
    test(name, body) {
      tests.push(new Test(name, body, { context }));
    },

    describe(name, body) {
      nestedSuites.push(new TestSuite(name, body, { context }));
    },

    ...contextSetups(context),
  });

  let nestedTests = await reduceAsync(nestedSuites, [], async (acc, suite) => {
    let tests = await suite.tests;
    return [...acc, ...tests];
  });

  return [...tests, ...nestedTests];
}

let contextSetupsMap = {
  assertBeforeTest: 'addBeforeTestAssertion',
  assertAfterTest: 'addAfterTestAssertion',
  setup: 'addSetup',
  teardown: 'addTeardown',
};

function contextSetups(context) {
  let result = {};

  for (let setupName in contextSetupsMap) {
    let contextName = contextSetupsMap[setupName];
    result[setupName] = (...args) => context[contextName](...args);
  }

  return result;
}
