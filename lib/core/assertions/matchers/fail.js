import { failure } from 'core/assertions/utils/matcher-result';

export function fail(message) {
  return failure(message);
}
