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

    this._tags = { timeout: 5000 };
  }

  copy() {
    let contextCopy = new TestContext();
    contextCopy._container = this._container.copy();
    contextCopy.parentIds = [...this.parentIds, this.id];
    contextCopy._tags = { ...this._tags };

    return contextCopy;
  }

  get names() {
    return this._container.names;
  }

  get name() {
    return joinNames(this.names);
  }

  get tags() {
    this._tags.name = this.name;
    return this._tags;
  }

  async runSetups() {
    let assigns = {};

    for (let setup of this._container.setups) {
      let newAssigns = await setup(assigns, this.tags);
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

  addTags(tags) {
    Object.assign(this.tags, ensureObject(tags));
  }

  addName(name) {
    this._add('names', name);
  }

  setup(setup) {
    this._add('setups', setup);
  }

  teardown(teardown) {
    this._add('teardowns', teardown);
  }

  assertBeforeTest(assertion) {
    this._add('beforeTestAssertions', assertion);
  }

  assertAfterTest(assertion) {
    this._add('afterTestAssertions', assertion);
  }

  toConfigurationAPI() {
    return createDelegator(this, {
      assertBeforeTest: true,
      assertAfterTest: true,
      setup: true,
      teardown: true,
      addName: true,
      addTags: true,
    });
  }

  _add(itemsName, item) {
    this._lock.throwIfLocked();
    this._container[itemsName].push(item);
  }
}

function joinNames(names) {
  let result = '';

  for (let name of names) {
    if (result !== '' && !startsWithSpecialSymbol(name)) {
      result += ' ';
    }

    result += name;
  }

  return result;
}

function startsWithSpecialSymbol(name) {
  return /^[.#::]/.test(name);
}

function ensureObject(item) {
  return isPlainObject(item) ? item : {};
}
