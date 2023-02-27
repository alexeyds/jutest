export class ArraysContainer {
  constructor(...arrayNames) {
    for (let name of arrayNames) {
      this[name] = [];
    }
  }

  copy() {
    let newContainer = new ArraysContainer();

    for (let key in this) {
      newContainer[key] = [...this[key]];
    }

    return newContainer;
  }
}
