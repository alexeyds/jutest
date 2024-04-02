export function buildTextSection(builderFunc, { padding=0 }={}) {
  let result = '';

  builderFunc({
    addLine: (lines='') => {
      lines.split("\n").forEach(line => {
        let extraSpaces = line === '' ? '' : " ".repeat(padding);
        result += extraSpaces + line + '\n';
      });
    },

    addSection: (builderFunc, config) => {
      let nestedPadding = config?.padding || 0;
      result += buildTextSection(builderFunc, { padding: padding + nestedPadding });
    }
  });

  return result;
}
