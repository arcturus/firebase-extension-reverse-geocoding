module.exports = {
  root: true,
  env: {
    node: true,
    commonjs: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "google",
  ],
  parserOptions: {
    "ecmaVersion": 8,
  },
  rules: {
    quotes: ["error", "double"],
  },
};
