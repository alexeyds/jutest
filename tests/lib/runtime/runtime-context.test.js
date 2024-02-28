import { jutest } from "jutest";
import { RuntimeContext } from "runtime";

jutest("RuntimeContext", s => {
  s.test("provides specs container and event emitter", t => {
    let context = new RuntimeContext();

    t.assert(context.runtimeEventEmitter);
    t.assert(context.specsContainer);    
  });
});
