import eslint from '@eslint/js';
import accessibility from 'eslint-plugin-jsx-a11y';
import hooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import typescript from 'typescript-eslint';

export default typescript.config(
  { ignores: ['**/dist/**', '**/coverage/**', 'test-results/**'] },
  eslint.configs.recommended,
  ...typescript.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: { globals: { ...globals.browser, ...globals.node, ...globals.jest } },
    plugins: { 'react-hooks': hooks, 'jsx-a11y': accessibility },
    rules: {
      ...hooks.configs.recommended.rules,
      ...accessibility.configs.recommended.rules,
      '@typescript-eslint/no-non-null-assertion': 'error',
    },
  },
);
