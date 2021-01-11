export function addPadding(text, numberOfSpaces) {
  return text
    .split('\n')
    .map(line => isBlank(line) ? line : pad(line, numberOfSpaces))
    .join('\n');
}

function isBlank(line) {
  return line.length === 0 || /^\s+$/.test(line);
}

function pad(line, numberOfSpaces) {
  return " ".repeat(numberOfSpaces) + line;
}

export function joinLines(...lines) {
  return lines.join('\n');
}

export function extractErrorStack(error) {
  return error.stack
    .replace(error.message, "")
    .split('\n')
    .slice(1)
    .map(l => l.replace(/^\s+/, ''))
    .join('\n');
}
