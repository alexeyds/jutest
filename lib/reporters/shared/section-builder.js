export class SectionBuilder {
  constructor({ padding=0 }={}) {
    this._linesAndSections = [];
    this._padding = padding;
  }

  addLine(line='') {
    this._linesAndSections.push(...line.split("\n"));
  }

  addSection({ padding }, build) {
    let builder = new SectionBuilder({ padding: padding + this._padding });
    build(builder);
    this._linesAndSections.push(builder);
  }

  toString() {
    let result = '';

    for (let lineOrSection of this._linesAndSections) {
      let line = lineOrSection.toString();

      if (typeof lineOrSection === 'string') {
        let padding = line === '' ? '' : " ".repeat(this._padding);
        result += padding + line;
        result += "\n";
      } else {
        result += line;
      }

    }

    return result;
  }
}
