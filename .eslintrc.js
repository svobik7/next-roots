// IMPORTANT: before adding any new rule check already existing bunch of rules in eslint-config-next
// @see https://nextjs.org/docs/basic-features/eslint#eslint-plugin

module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier',
  ],
  env: {
    browser: true,
    node: true,
  },
  ignorePatterns: ['examples/*', 'dist/*'],
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'simple-import-sort',
    'unused-imports',
    'import',
  ],
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: ['examples/*/tsconfig.json', 'tsconfig.json'],
      },
      node: true,
    },
  },
  rules: {
    eqeqeq: 'error',
    'no-caller': 'error',
    'no-bitwise': 'error',
    'no-cond-assign': 'error',
    'no-return-await': 'error',
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'no-debugger': 'error',
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    // e.g. "@typescript-eslint/explicit-function-return-type": "off",
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/consistent-type-imports': 'error',
    // groups duplicated imports
    'import/no-duplicates': [
      'error',
      { considerQueryString: true, 'prefer-inline': true },
    ],
    // sorts imports automatically
    // based on specified groups
    'simple-import-sort/imports': [
      'warn',
      {
        groups: [
          [
            // Side effect imports.
            '^\\u0000',
            // Packages.
            // Things that start with a letter (or digit or underscore), or `@` followed by a letter.
            '^@?\\w',
            // Absolute imports and other imports such as Vue-style `@/foo`.
            // Anything that does not start with a dot.
            '^[^.]',
            // Relative imports.
            // Anything that starts with a dot.
            '^\\.',
          ],
        ],
      },
    ],
    // removes unused imports and variables automatically
    // while underscore prefixed variables are ignored
    '@typescript-eslint/no-unused-vars': 'off',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
  },
}
