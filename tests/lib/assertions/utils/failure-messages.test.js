import jutest from 'jutest';
import { assertionFailedMessage, negationFailedMessage } from "assertions/utils/failure-messages";

jutest('assertions/utils/failure-messages', s => {
  s.describe("assertionFailedMessage", s => {
    s.test('composes failure message', t => {
      let message = assertionFailedMessage({ expected: {a: 1}, actual: 2, operator: 'equal' });

      t.match(message, /equal/);
      t.match(message, /a: 1/);
    });
  });

  s.describe("negationFailedMessage", s => {
    s.test('composes failure message', t => {
      let message = negationFailedMessage({ expected: {a: 1}, actual: {a: 1}, operator: 'notEqual' });

      t.match(message, /notEqual/);
      t.match(message, /a: 1/);
    });
  });
});
