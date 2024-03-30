export function sum(array, mapper) {
  return array.reduce((sum, item) => {
    let number = mapper ? mapper(item) : item;
    return sum + number;
  }, 0);
}
