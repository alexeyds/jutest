import { jutest } from 'jutest';
import { same, notSame } from "assertions/matchers/same";

jutest('assertions/matchers/same', s => {
  s.describe("same()", s => {
    s.test('passes if two objects have the same structure', t => {
      let result = same({a: 1}, {a: 1});
      t.equal(result.passed, true);
    });

    s.test('fails if objects are different', t => {
      let result = same({a: 1}, {a: 2});

      t.equal(result.passed, false);
      t.match(result.failureMessage.toString(), /same/);
    });
  });

  s.describe("notSame()", s => {
    s.test('fails if two objects are equal', t => {
      let result = notSame({a: 1}, {a: 1});
      t.equal(result.passed, false);
    });

    s.test('passes if objects are different', t => {
      let result = notSame({a: 1}, {a: 2});

      t.equal(result.passed, true);
      t.assert(result.failureMessage.toString(), /notSame/);
    });
  });
});