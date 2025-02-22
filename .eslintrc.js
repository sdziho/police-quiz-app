module.exports = {
  root: true,
  parser: '@babel/eslint-parser',
  extends: 'airbnb',
  plugins: ['react-hooks'],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.ios.js', '.android.js'],
      },
    },
  },
  rules: {
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        ts: 'never',
        tsx: 'never',
        js: 'never',
        jsx: 'never',
        mjs: 'never',
        '': 'never',
      },
    ],
    'linebreak-style': 0,
    'arrow-body-style': 0,
    'arrow-parens': 0,
    'global-require': 0,
    camelcase: 0,
    'react/prop-types': 0,
    'consistent-return': 0,
    'react/jsx-filename-extension': 0,
    'class-methods-use-this': 0,
    'no-use-before-define': 0,
    'react/forbid-prop-types': 0,
    'react/no-unused-prop-types': 0,
    'react/require-default-props': 0,
    'react/no-string-refs': 0,
    'import/prefer-default-export': 0,
    'no-case-declarations': 0,
    'no-underscore-dangle': 0,
    'react/no-did-mount-set-state': 0,
    'react/destructuring-assignment': 0,
    'import/no-cycle': 0,
    'react/jsx-one-expression-per-line': 0,
    'import/no-unresolved': [
      0,
      { ignore: ['.png$', '.jpg$', '.svg$', '.index.native'] },
    ],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'max-classes-per-file': ['error', 10],
    'max-len': [
      'error',
      {
        code: 200,
        ignoreComments: true,
        ignoreTrailingComments: true,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
      },
    ],
  },
  globals: {
    __DEV__: true,
  },
};
