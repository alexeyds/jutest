import sortBy from "lodash.sortby";
import { murmurHash3 } from "./murmur-hash3";

export function shuffleArray(array, { seed, getId }) {
  let sortFunc = item => murmurHash3(getId(item), seed)
  return sortBy(array, [sortFunc]);
}
