import { jutest } from "jutest";
import { IDSequence } from "core/test-context/id-sequence";

jutest("IDSequence", s => {
  s.describe("#generateID", s => {
    s.test("returns a sequence of ids on each call", t => {
      let idSequence = new IDSequence();

      t.equal(idSequence.generateID(), 1);
      t.equal(idSequence.generateID(), 2);
      t.equal(idSequence.generateID(), 3);
    });
  });
});
