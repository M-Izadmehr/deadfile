module.exports = {
  env: {
    node: true,
    commonjs: true,
    browser: true,
    es6: true,
    jest: true
  },
  plugins: ["prettier"],
  extends: ["eslint:recommended", "prettier"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },
  parserOptions: {
    ecmaVersion: 2018,
    "sourceType": "module"
  },
  rules: {
    "prettier/prettier": "error"
  },
};
