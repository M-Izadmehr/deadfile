module.exports = {
  env: {
    node: true,
    commonjs: true,
    es6: true
  },
  plugins: ["prettier"],
  extends: ["eslint:recommended", "prettier"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },
  parserOptions: {
    ecmaVersion: 2018
  },
  rules: {
    "prettier/prettier": "error"
  },
};
