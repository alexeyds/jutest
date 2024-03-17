import { jutest } from "jutest";
import { TestRunnerEventEmitter } from "test-runner/context/event-emitter";
import { TestRunnerEnums } from "test-runner";
import { spy } from "sinon";

const { Events } = TestRunnerEnums;

jutest("TestRunnerEventEmitter", s => {
  s.test("has EventEmitter interface", async t => {
    let emitter = new TestRunnerEventEmitter();
    let listener = spy();

    emitter.on(Events.SuiteStart, listener);
    await emitter.emit(Events.SuiteStart, 'test');
    emitter.off(Events.SuiteStart, listener);
    await emitter.emit(Events.SuiteStart, 'test');

    t.equal(listener.callCount, 1);
    t.equal(listener.firstCall.args[0], 'test');
  });
});
