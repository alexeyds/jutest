export function buildSection(builderFunc, { padding=0 }={}) {
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
      result += buildSection(builderFunc, { padding: padding + nestedPadding });
    }
  });

  return result;
}

buildSection.withPadding = function withPadding(padding=0) {
  return (builder) => {
    return buildSection(builder, { padding });
  };
};
