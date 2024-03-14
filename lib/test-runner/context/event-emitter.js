import { EventEmitter } from "utils/event-emitter";
import { createDelegator } from "utils/delegator";
import { TestRunnerEnums } from "test-runner/enums";

export class TestRunnerEventEmitter {
  constructor() {
    let eventEmitter = new EventEmitter(Object.values(TestRunnerEnums.Events));

    Object.assign(this, createDelegator(eventEmitter, {
      on: 'on',
      off: 'off',
      emit: 'emit',
    }));
  }
}
