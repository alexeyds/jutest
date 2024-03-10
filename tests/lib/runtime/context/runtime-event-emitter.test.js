import { jutest } from "jutest";
import { RuntimeEventEmitter } from "runtime/context/runtime-event-emitter";
import { RuntimeEvents } from "runtime";
import { spy } from "sinon";

jutest("RuntimeEventEmitter", s => {
  s.test("has EventEmitter interface", async t => {
    let emitter = new RuntimeEventEmitter();
    let listener = spy();

    emitter.on(RuntimeEvents.RunStart, listener);
    await emitter.emit(RuntimeEvents.RunStart, 'test');
    emitter.off(RuntimeEvents.RunStart, listener);
    await emitter.emit(RuntimeEvents.RunStart, 'test');

    t.equal(listener.callCount, 1);
    t.equal(listener.firstCall.args[0], 'test');
  });
});
