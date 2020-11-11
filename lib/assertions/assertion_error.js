export default class AssertionError extends Error {
  constructor(assertionResult) {
    super("Failed assertion");

    this.details = assertionResult.failureDetails;
  }
}