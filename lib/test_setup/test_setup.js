import { resolveAsyncFunctionsInOrder } from 'utils/promise';

export default class TestSetup {
  constructor() {
    this._callbacks = {
      teardown: [],
      setup: [],
      beforeTestEnd: []
    };
  }

  setup(func) {
    this._addCallback('setup', func);
  }

  runSetups() {
    let initialSetup = () => ({});

    let setups = [initialSetup, ...this._getCallbacks('setup')].map(s => {
      return async (previousAssigns) => {
        let currentAssigns = await s(previousAssigns);
        return { ...previousAssigns, ...currentAssigns };
      };
    });

    return resolveAsyncFunctionsInOrder(setups);
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
