/* eslint-env node */
module.exports = {
  'env': {
    'commonjs': true,
    'es2021': true,
    'node': true,
    'jest': true
  },
  'extends': 'eslint:recommended',
  'parserOptions': {
    'ecmaVersion': 'latest'
  },
  'rules': {
    'indent': [
      'error',
      2
    ],
    'linebreak-style': [
      'error',
      'unix'
    ],
    'quotes': [
      'error',
      'single'
    ],
    'semi': [
      'error',
      'never'
    ],
    'eqeqeq': 'error',
    'no-trailing-spaces': 'error',
    'object-curly-spacing': [
      'error', 'always'
    ],
    'arrow-spacing': [
      'error', { 'before': true, 'after': true }
    ],
    'no-console': 0,
    'react/prop-types': 0,
    'react/react-in-jsx-scope': 'off'
  },
  'settings': {
    'react': {
      'version': 'detect'
    }
  }
}