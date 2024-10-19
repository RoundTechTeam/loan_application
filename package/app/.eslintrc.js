module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2021
  },
  env: {
    node: true,
  },

  // Rules order is important, please avoid shuffling them
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/typescript/recommended',
    'plugin:prettier/recommended',
  ],

  globals: {
    ga: 'readonly', // Google Analytics
    chrome: true,
    cordova: true
  },

  // add your custom rules here
  rules: {
     quotes: ['warn', 'single'],
    'prefer-promise-reject-errors': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'object-curly-spacing': ['error', 'always'],
    "@typescript-eslint/no-use-before-define": 0,
    '@typescript-eslint/ban-ts-ignore': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    'vue/multi-word-component-names': 'off',
    'no-trailing-spaces': 'error'
  },
  ignorePatterns: ['**/assets/**'],
};
