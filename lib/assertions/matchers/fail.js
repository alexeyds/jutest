import { failure } from 'assertions/utils/matcher-result';

export function fail(message) {
  return failure(message);
}
