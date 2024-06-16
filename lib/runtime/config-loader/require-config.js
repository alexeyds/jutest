import { resolveToCwd } from "utils/file";

export function requireConfig({ requireFunc=require, filePath }) {
  try {
    return requireFunc(resolveToCwd(filePath || 'jutest.config'));
  } catch(e) {
    if (!filePath && e instanceof Error && e.code === "MODULE_NOT_FOUND") {
      return {};
    } else {
      throw e;
    }
  }
}
