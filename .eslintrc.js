module.exports = {
  extends: ['next/core-web-vitals', 'plugin:tailwindcss/recommended'],
  ignorePatterns: ['!.lintstagedrc.js'],
  plugins: [
    'tailwindcss',
    'import',
    'unused-imports',
    'prettier',
    '@typescript-eslint',
  ],
  parser: '@typescript-eslint/parser',
  rules: {
    'tailwindcss/classnames-order': 'warn',
    'tailwindcss/no-custom-classname': 'warn',
    'tailwindcss/enforces-negative-arbitrary-values': 'warn',
    'unused-imports/no-unused-imports': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
    //未使用のexportにエラー出力
    // 'import/no-unused-modules': ['error', { unusedExports: true }],
    'no-console': 'warn',
    'no-debugger': 'warn',
    semi: ['warn', 'never'],
    quotes: ['warn', 'single'],
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
  },
  overrides: [
    //page.tsxのexportを許可
    {
      files: ['**/page.tsx', '**/pages/**/*.tsx', '**/app/**/*.tsx'],
      rules: {
        'import/no-unused-modules': 'off',
      },
    },
  ],
}
