import baseConfig from './tooling/eslint-config/base.js';
import { globalIgnores } from 'eslint/config';

export default [
  ...baseConfig,
  globalIgnores(['apps', 'packages']),
  {
    files: ['**/*.js'],
    languageOptions: {
      globals: {
        module: 'readonly',
        require: 'readonly',
        __dirname: 'readonly',
      },
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
];
