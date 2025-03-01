import { jutest } from "jutest";
import { isEqual } from "assertions/shared/equality-checks";

jutest("isEqual", s => {
  s.test('returns true if two objects are equal', t => {
    t.equal(isEqual(1, 1), true);
  });

  s.test('returns true if objects are different', t => {
    t.equal(isEqual(1, 2), false);
  });

  s.test('uses Object.is', t => {
    t.equal(isEqual({}, {}), false);
    t.equal(isEqual(-0, 0), false);
  });
});
