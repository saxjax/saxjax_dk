import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import angular from "angular-eslint"
import eslintConfigPrettier from "eslint-config-prettier";



/** @type {import('eslint').Linter.Config[]} */
export default [
  {files: ["**/*.{js,mjs,cjs,ts}"]},
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.stylistic,
  ...angular.configs.tsRecommended,
  ...eslintConfigPrettier,
];
