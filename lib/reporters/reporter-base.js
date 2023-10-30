export class ReporterBase {
  reportTest() {
    throw new Error('Must be implemented in the derived class');
  }

  reportSummary() {
    throw new Error('Must be implemented in the derived class');
  }
}
