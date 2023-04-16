import { reduceAsync, createOrderedResolver } from "utils/async";
import { deepMerge, isPlainObject } from "utils/object";
import { ArraysContainer } from "./utils/arrays-container";

export class TestContext {
  constructor() {
    this._container = new ArraysContainer(
      'names',
      'setups',
      'teardowns',
      'beforeTestAssertions',
      'afterTestAssertions',
    );
  }

  copy() {
    let contextCopy = new TestContext();
    contextCopy._container = this._container.copy();
    return contextCopy;
  }

  get names() {
    return this._container.names;
  }

  testName(name) {
    return [...this.names, name].join(' ');
  }

  runSetups() {
    let { setups } = this._container;

    return reduceAsync(setups, {}, async (assigns, setup) => {
      let newAssigns = await setup(assigns);
      return deepMerge(assigns, ensureObject(newAssigns));
    });
  }

  get runTeardowns() {
    return createOrderedResolver(this._container.teardowns);
  }

  get runBeforeTestAssertions() {
    return createOrderedResolver(this._container.beforeTestAssertions);
  }

  get runAfterTestAssertions() {
    return createOrderedResolver(this._container.afterTestAssertions);
  }

  addName(name) {
    this._add('names', name);
  }

  addSetup(setup) {
    this._add('setups', setup);
  }

  addTeardown(teardown) {
    this._add('teardowns', teardown);
  }

  addBeforeTestAssertion(assertion) {
    this._add('beforeTestAssertions', assertion);
  }

  addAfterTestAssertion(assertion) {
    this._add('afterTestAssertions', assertion);
  }

  _add(itemsName, item) {
    this._container[itemsName].push(item);
  }
}

function ensureObject(item) {
  return isPlainObject(item) ? item : {};
}
