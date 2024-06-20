import { jutest } from "jutest";
import { shuffleArray } from "utils/shuffle-array";

jutest("shuffleArray", s => {
  s.test("re-arranges array", t => {
    let array = [4, 5, 1, 6, 7, 8];
    let result = shuffleArray(array, { getId: (i) => i }); 

    t.same(result, [8, 4, 5, 7, 6, 1]);
  });

  s.test("accepts seed", t => {
    let array = [4, 5, 1, 6, 7, 8];
    let result = shuffleArray(array, { seed: 41959, getId: (i) => i }); 

    t.same(result, [4, 6, 7, 8, 1, 5]);
  });
});
