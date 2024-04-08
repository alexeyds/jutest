import { jutest } from "jutest";
import { spy } from "sinon";
import { EventEmitter } from "utils/event-emitter";

jutest("EventEmitter", s => {
  s.setup(() => {
    return {
      emitter: new EventEmitter(["start", "finish"])
    };
  });

  s.describe("#emit", s => {
    s.test("does nothing without listeners", async (t, { emitter }) => {
      await emitter.emit('start');
    });

    s.test("passes provided arguments to the listener", async (t, { emitter }) => {
      let listener = spy();
      emitter.on('start', listener);

      await emitter.emit('start', 1, 2, 3);

      t.same(listener.firstCall.args, [1, 2, 3]);
    });

    s.test("validates event is supported", async (t, { emitter }) => {
      await t.async.rejects(emitter.emit('test'), /supported/);
    });
  });

  s.describe("#on", s => {
    s.test("adds event listener", async (t, { emitter }) => {
      let listener = spy();
      emitter.on('start', listener);

      await emitter.emit('start');

      t.equal(listener.called, true);
    });

    s.test("supports multiple listeners", async (t, { emitter }) => {
      let listener1 = spy();
      let listener2 = spy();
      emitter.on('start', listener1);
      emitter.on('start', listener2);

      await emitter.emit('start');

      t.equal(listener1.called, true);
      t.equal(listener2.called, true);
    });

    s.test("validates event is supported", (t, { emitter }) => {
      t.throws(() => emitter.on('test', () => {}), /supported/);
    });
  });

  s.describe("#off", s => {
    s.test("removes a listener", async (t, { emitter }) => {
      let listener1 = spy();
      let listener2 = spy();
      emitter.on('start', listener1);
      emitter.on('start', listener2);
      emitter.off('start', listener1);

      await emitter.emit('start');

      t.equal(listener1.called, false);
      t.equal(listener2.called, true);
    });

    s.test("validates event is supported", (t, { emitter }) => {
      t.throws(() => emitter.off('test', () => {}), /supported/);
    });
  });
});
