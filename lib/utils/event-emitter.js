export class EventEmitter {
  constructor(supportedEvents) {
    this.supportedEvents = supportedEvents;

    this._listeners = {};
    this.supportedEvents.forEach(e => this._listeners[e] = []);
  }

  on(eventName, listener) {
    this._getListeners(eventName).push(listener);
  }

  off(eventName, listener) {
    let listeners = this._getListeners(eventName);
    this._listeners[eventName] = listeners.filter(l => l !== listener);
  }

  async emit(eventName, ...args) {
    return await Promise.all(this._getListeners(eventName).map(listener => {
      listener(...args);
    }));
  }

  _getListeners(eventName) {
    if (!this.supportedEvents.includes(eventName)) {
      throw new Error(`Event ${eventName} is not supported. Supported events are: ${this.supportedEvents.join(', ')}`);
    }

    return this._listeners[eventName];
  }
}
