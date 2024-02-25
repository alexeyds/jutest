import { createOrderedResolver } from "utils/async";
import { deepMerge, isPlainObject } from "utils/object";
import { createDelegator } from "utils/delegator";
import { Lock } from "utils/lock";
import { IDSequence } from "./id-sequence";
import { ArraysContainer } from "./arrays-container";

const ID_SEQUENCE = new IDSequence();

export class TestContext {
  constructor() {
    this.id = ID_SEQUENCE.generateID();
    this.parentIds = [];

    this._lock = new Lock();

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
    contextCopy.parentIds = [...this.parentIds, this.id];
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

  lock(...args) {
    this._lock.lock(...args);
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

  toConfigurationAPI() {
    return createDelegator(this, {
      addBeforeTestAssertion: 'assertBeforeTest',
      addAfterTestAssertion: 'assertAfterTest',
      addSetup: 'setup',
      addTeardown: 'teardown',
      addName: 'name',
    });
  }

  _add(itemsName, item) {
    this._lock.throwIfLocked();
    this._container[itemsName].push(item);
  }
}

function ensureObject(item) {
  return isPlainObject(item) ? item : {};
}
