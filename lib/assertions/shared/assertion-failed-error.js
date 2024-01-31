export class AssertionFailedError extends Error {
  constructor() {
    super(...arguments);
    this.name = 'AssertionFailedError';
  }
}
