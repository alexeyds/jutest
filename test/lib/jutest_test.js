import jutest from 'jutest';

jutest('jutest', s => {
  s.test('runs tests', t => {
    t.assert(true);
  });

  s.describe('supports nested suites', s => {
    s.test('test', t => {
      t.assert(true);
    });
  });
});