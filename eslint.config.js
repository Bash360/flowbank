import eslintPlugin from '@typescript-eslint/eslint-plugin';
import eslintParser from '@typescript-eslint/parser';
import unusedImports from 'eslint-plugin-unused-imports'; // ✅ Import it properly

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
      'unused-imports': unusedImports, // ✅ Now it's correctly referenced
    },
    rules: {
      semi: ['error', 'always'],
      quotes: ['error', 'double'],
      'unused-imports/no-unused-imports': 'warn', // ✅ This rule will now work
    },
  },
];
