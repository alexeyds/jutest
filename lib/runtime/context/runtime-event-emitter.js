import { EventEmitter } from "utils/event-emitter";
import { createDelegator } from "utils/delegator";
import { RuntimeEvents } from "runtime/enums";

export class RuntimeEventEmitter {
  constructor() {
    let eventEmitter = new EventEmitter(Object.values(RuntimeEvents));

    Object.assign(this, createDelegator(eventEmitter, {
      on: 'on',
      off: 'off',
      emit: 'emit',
    }));
  }
}
