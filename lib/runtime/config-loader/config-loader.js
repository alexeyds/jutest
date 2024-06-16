import { requireConfig } from "./require-config";

export function loadConfigFile(filePath) {
  return requireConfig({ filePath });
}
