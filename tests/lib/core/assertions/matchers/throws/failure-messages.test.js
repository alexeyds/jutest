import jutest from "jutest";
import { noErrorThrownMessage, wrongErrorThrownMessage } from "core/assertions/matchers/throws/failure-messages";

jutest("throws/failure-messages", s => {
  s.describe("noErrorThrownMessage()", s => {
    s.test("composes a message", t => {
      let message = noErrorThrownMessage({ expected: 'test' });
      t.match(message, /test/);
    });

    s.test("inspects classes properly", t => {
      class Foobar {}
      let message = noErrorThrownMessage({ expected: Foobar });

      t.match(message, /`Foobar`/);
    });
  });

  s.describe("wrongErrorThrownMessage", s => {
    s.test("composes a message", t => {
      let message = wrongErrorThrownMessage({ expected: 'test', actual: 'foo' });

      t.match(message, /test/);
      t.match(message, /foo/);
    });
  });
});
