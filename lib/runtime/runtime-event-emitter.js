import { EventEmitter } from "utils/event-emitter";
import { createDelegator } from "utils/delegator";

const Events = {
  RunStart: 'run-start',
  SuiteStart: 'suite-start',
  TestSkip: 'test-skip',
  TestStart: 'test-start',
  TestEnd: 'test-end',
  SuiteEnd: 'suite-end',
  RunEnd: 'run-end',
};

export class RuntimeEventEmitter {
  static Events = Events;

  constructor() {
    let eventEmitter = new EventEmitter(Object.values(Events));

    Object.assign(this, createDelegator(eventEmitter, {
      on: 'on',
      off: 'off',
      emit: 'emit',
    }));
  }
}
