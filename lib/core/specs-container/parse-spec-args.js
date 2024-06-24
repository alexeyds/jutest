export function parseSpecArgs(args) {
  let [name, tagsOrBody, bodyOrNothing] = args;
  let tags, body;

  if (typeof tagsOrBody === 'function') {
    body = tagsOrBody;
  } else {
    tags = tagsOrBody;
    body = bodyOrNothing;
  }

  return {
    name,
    body,
    tags,
  };
}
