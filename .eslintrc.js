'use strict';

module.exports = {
  globals: {
    expect: false,
    Factory: false,
  },
  parserOptions: {
    ecmaVersion: 2018,
    impliedStrict: true,
  },
  extends: 'lob',
  rules: {
    'no-console': 0,
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'comma-dangle': ['error', 'always-multiline'],
  },
};
