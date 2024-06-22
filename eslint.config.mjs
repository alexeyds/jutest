import globals from "globals";
import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },

      ecmaVersion: 2023,
      sourceType: "module",
    },

    rules: {
      "no-unused-vars": ["error", {
        varsIgnorePattern: "^_",
        argsIgnorePattern: "^_",
      }],

      indent: ["error", 2, {
        SwitchCase: 1,
      }],

      "linebreak-style": ["error", "unix"],
      semi: ["error", "always"],
    },
  }
];
