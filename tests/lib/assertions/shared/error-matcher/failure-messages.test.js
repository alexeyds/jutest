import { jutest } from "jutest";
import { noErrorThrownMessage, wrongErrorThrownMessage } from "assertions/shared/error-matcher/failure-messages";

jutest("error-matchers/failure-messages", s => {
  s.describe("noErrorThrownMessage()", s => {
    s.test("composes a message", t => {
      let message = noErrorThrownMessage({ expected: 'test', operator: 'operatorName' });

      t.match(message, /test/);
      t.match(message, /operatorName/);
    });

    s.test("inspects classes properly", t => {
      class Foobar {}
      let message = noErrorThrownMessage({ expected: Foobar });

      t.match(message, /`Foobar`/);
    });

    s.test("supports promise error messages", t => {
      let message = noErrorThrownMessage({ expected: 'test', operator: 'rejects', isAPromise: true });

      t.match(message, /test/);
      t.match(message, /rejects/);
    });
  });

  s.describe("wrongErrorThrownMessage", s => {
    s.test("composes a message", t => {
      let message = wrongErrorThrownMessage({ expected: 'test', actual: 'foo', operator: 'operatorName' });

      t.match(message, /test/);
      t.match(message, /foo/);
      t.match(message, /operatorName/);
    });
  });
});
