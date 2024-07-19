// IMPORTANT: before adding any new rule check already existing bunch of rules in eslint-config-next
// @see https://nextjs.org/docs/basic-features/eslint#eslint-plugin

module.exports = {
  root: true,
  extends: ['plugin:tailwindcss/recommended', 'next/core-web-vitals'],
  parser: '@typescript-eslint/parser',
}
