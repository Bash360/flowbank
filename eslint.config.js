import eslintPlugin from '@typescript-eslint/eslint-plugin';
import eslintParser from '@typescript-eslint/parser';

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  {
    ignores: ['node_modules/', 'dist/'],
  },
  {
    languageOptions: {
      parser: eslintParser,
    },
    plugins: {
      '@typescript-eslint': eslintPlugin,
    },
    rules: {
      semi: ['error', 'always'],
      quotes: ['error', 'double'],
    },
  },
];
