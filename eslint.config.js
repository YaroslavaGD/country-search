import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  { ignores: ['dist/**', 'node_modules/**'] },
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ['**/*.{js,ts}'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.browser,
    },
    rules: {
      'no-var': 'error',
      'prefer-const': 'error',
      'no-console': 'warn',
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
  prettier,
);
