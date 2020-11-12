import { resolveAsyncFunctionsInOrder } from 'utils/promise';

export default class TestSetup {
  constructor() {
    this._callbacks = {
      teardown: [],
      setup: [ () => ({}) ],
      beforeTestEnd: []
    };
  }

  clone() {
    let clonedSetup = new TestSetup();

    let callbacksCopy = {};
    for (let k in this._callbacks) {
      callbacksCopy[k] = [...this._callbacks[k]];
    }

    clonedSetup._callbacks = callbacksCopy;

    return clonedSetup;
  }

  setup(func) {
    let callback = async (previousAssigns) => {
      let currentAssigns = await func(previousAssigns);
      return { ...previousAssigns, ...currentAssigns };
    };

    this._addCallback('setup', callback);
  }

  runSetups() {
    return resolveAsyncFunctionsInOrder(this._getCallbacks('setup'));
  }

  teardown(func) {
    this._addCallback('teardown', func);
  }

  runTeardowns() {
    return this._runCallbacks('teardown', arguments);
  }

  beforeTestEnd(func) {
    this._addCallback('beforeTestEnd', func);
  }

  runBeforeTestEndCallbacks() {
    return this._runCallbacks('beforeTestEnd', arguments);
  }

  _runCallbacks(scope, args) {
    return resolveAsyncFunctionsInOrder(this._getCallbacks(scope).map(t => () => t(...args)));
  }

  _addCallback(scope, func) {
    this._callbacks[scope].push(func);
  }

  _getCallbacks(scope) {
    return this._callbacks[scope];
  }
}
