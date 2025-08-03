module.exports = {
  root: true,
  globals: {
    html2canvas: true,
    baseurl: true,
    state: true,
    Vue: true,
    em: true,
    rem: true,
  },
  env: {
    node: true,
    browser: true,
    es2021: true,
  },
  extends: ['plugin:vue/essential'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
  },
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
}
