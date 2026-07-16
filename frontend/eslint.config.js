import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
  { ignores: ['dist/', 'node_modules/', 'e2e/'] },
  { files: ['**/*.{ts,tsx}'] },
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    plugins: { 'react-hooks': pluginReactHooks },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
    settings: { react: { version: 'detect' } },
  },
  eslintConfigPrettier,
);
