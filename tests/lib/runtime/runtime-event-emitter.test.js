import { jutest } from "jutest";
import { RuntimeEventEmitter } from "runtime";
import { spy } from "sinon";

const { Events } = RuntimeEventEmitter;

jutest("RuntimeEventEmitter", s => {
  s.test("has EventEmitter interface", async t => {
    let emitter = new RuntimeEventEmitter();
    let listener = spy();

    emitter.on(Events.RunStart, listener);
    await emitter.emit(Events.RunStart, 'test');
    emitter.off(Events.RunStart, listener);
    await emitter.emit(Events.RunStart, 'test');

    t.equal(listener.callCount, 1);
    t.equal(listener.firstCall.args[0], 'test');
  });
});
