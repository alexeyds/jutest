import { jutest } from "jutest";
import { Lock } from "utils/lock";

jutest("Lock", s => {
  s.setup(() => {
    let lock = new Lock();
    return { lock };
  });

  s.describe("constructor", s => {
    s.test("assigns initial attributes", (t, { lock }) => {
      t.equal(lock.isLocked, false);
    });
  });

  s.describe("#lock", s => {
    s.test("sets isLocked to true", (t, { lock }) => {
      lock.lock();
      t.equal(lock.isLocked, true);
    });
  });

  s.describe("#throwIfLocked", s => {
    s.test("does nothing if the lock is not locked", (t, { lock }) => {
      lock.throwIfLocked(() => {});
    });

    s.test("throws the provided error when locked", (t, { lock }) => {
      lock.lock('my error');
      t.throws(() => lock.throwIfLocked(), /my error/);
    });
  });
});
