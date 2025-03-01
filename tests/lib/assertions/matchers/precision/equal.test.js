// import { jutest } from 'jutest';
// import { equal, notEqual } from "assertions/matchers/precision/equal";

// jutest('assertions/matchers/precision/equal', s => {
//   s.describe("equal()", s => {
//     s.test('passes if two objects are equal', t => {
//       let result = equal(1, 1);

//       t.equal(result.passed, true);
//     });

//     s.test('fails if objects are different', t => {
//       let result = equal(1, 2);

//       t.equal(result.passed, false);
//       t.match(result.failureMessage.toString(), /equal/);
//     });

//     s.test('uses Object.is', t => {
//       t.equal(equal({}, {}).passed, false);
//       t.equal(equal(-0, 0).passed, false);
//     });
//   });

//   s.describe("notEqual()", s => {
//     s.test('passes if two objects are not equal', t => {
//       t.equal(notEqual(1, 2).passed, true);
//     });

//     s.test('fails if objects are equal', t => {
//       let result = notEqual(1, 1);

//       t.equal(result.passed, false);
//       t.match(result.failureMessage.toString(), /notEqual/);
//     });
//   });
// });
