module.exports = {
  extends: '../../.eslintrc.js',
  ignorePatterns: ['.husky', 'dist', 'public', 'node_modules', '*.json', '*.less'],
  rules: {
    'n/prefer-global/process': 0,
    '@typescript-eslint/no-require-imports': 0,
    'antfu/no-cjs-exports': 0,
    '@typescript-eslint/no-var-requires': 0,
    'no-console': 0,
    'n/prefer-global/buffer': 0,
  },
}
