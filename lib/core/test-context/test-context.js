import { createOrderedResolver } from "utils/async";
import { deepMerge, isPlainObject } from "utils/object";
import { ArraysContainer } from "./arrays-container";

export class TestContext {
  constructor() {
    this.isLocked = false;

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

  get name() {
    return this.names.join(' ');
  }

  testName(name) {
    return [...this.names, name].join(' ');
  }

  async runSetups() {
    let assigns = {};

    for (let setup of this._container.setups) {
      let newAssigns = await setup(assigns);
      assigns = deepMerge(assigns, ensureObject(newAssigns));
    }

    return assigns;
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

  lock(customErrorMessage) {
    this.isLocked = true;
    this.customLockedErrorMessage = customErrorMessage;
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
    if (this.isLocked) {
      const message = this.customLockedErrorMessage || "This TestContext is locked and can no longer be modified.";
      throw new Error(message);
    }
    this._container[itemsName].push(item);
  }
}

function ensureObject(item) {
  return isPlainObject(item) ? item : {};
}
