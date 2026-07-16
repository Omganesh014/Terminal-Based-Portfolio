import globals from 'globals';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
  { ignores: ['node_modules/'] },
  { files: ['**/*.js'] },
  { languageOptions: { globals: globals.node } },
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
);
