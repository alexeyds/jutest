import { runtime } from "./runtime-instance";
let { jutest } = runtime;

jutest('main suite', s => {
  s.describe('suite 1', t => {
    t.test('test 1', () => {});
    t.test('test 2', () => {});
  });
});

jutest.test('top level test', () => {})