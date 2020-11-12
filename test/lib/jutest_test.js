import jutest from 'jutest';

jutest.setup(() => ({jutest: 'hello'}));

jutest('jutest', s => {
  s.test('runs tests', t => {
    t.assert(true);
  });

  s.describe('supports nested suites', s => {
    s.test('test', t => {
      t.assert(true);
    });
  });

  s.test('supports TestSetup helpers in top scope', (t, assigns) => {
    t.same(assigns, { jutest: 'hello' });
  });
});
