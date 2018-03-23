module.exports = {
  parserOptions: { ecmaVersion: 8 },
  env: { node: true, es6: true, browser: true, },
  extends: ['eslint:recommended', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': [ 'error',
      {
        singleQuote: true,
        trailingComma: 'all',
      },
    ],
   "comma-dangle": ["error", "always-multiline"],
    eqeqeq: ['error', 'always'],
  },
};
