import pluginJs from '@eslint/js'
import angular from 'angular-eslint'
import eslintConfigPrettier from 'eslint-config-prettier'
import * as unusedImports from 'eslint-plugin-unused-imports'
import globals from 'globals'
import tseslint from 'typescript-eslint'

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { ignores: ['dist', '.angular', 'pnpm-lock.yaml'] },
  { languageOptions: { globals: globals.browser } },
  {
    plugins: {
      'unused-imports': unusedImports,
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.stylistic,
  ...angular.configs.tsRecommended,
  eslintConfigPrettier,
]
