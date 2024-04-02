import { inspect } from 'util';
import { buildTextSection } from "utils/text-section";

export function assertionFailedMessage({expected, actual, operator}) {
  let expectedText = 'expected: ';
  let gotText      = '     got: ';

  return (
    `${expectedText}${inspectedValueSection(expectedText, expected)}` +
    `${gotText}${inspectedValueSection(gotText, actual)}` +
    '\n' +
    `(operator: ${operator})`
  );
}

export function negationFailedMessage({expected, actual, operator}) {
  let expectedText = 'expected: not ';
  let gotText      = '     got: ';

  return (
    `${expectedText}${inspectedValueSection(gotText, expected)}` +
    `${gotText}${inspectedValueSection(gotText, actual)}` +
    '\n' +
    `(operator: ${operator})`
  );
}

function inspectedValueSection(prefixText, value) {
  let section = buildTextSection(s => {
    s.addLine(inspect(value));
  }, { padding: prefixText.length });

  return section.trimStart();
}
