const path = require("path");
module.exports = {
  parser: "babel-eslint",
  plugins: ["prettier"],
  parserOptions: {
    sourceType: "module"
  },
  rules: {
    "prettier/prettier": "error"
  },
  extends: ["prettier"],
  overrides: [
    {
      files: ["**/*.ts", "**/*.tsx"],
      plugins: ["@typescript-eslint"],
      extends: [
        "plugin:@typescript-eslint/recommended",
        "prettier/@typescript-eslint",
        "plugin:prettier/recommended",
        "plugin:react/recommended"
      ],
      rules: {
        "prettier/prettier": "error",
        "react/prop-types": "off",
        "@typescript-eslint/no-unused-vars": [
          "error",
          {
            "argsIgnorePattern": "^_"
          }
        ],
      },
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: path.resolve(__dirname, "./tsconfig.json"),
        tsconfigRootDir: __dirname,
        ecmaVersion: 2018,
        sourceType: "module"
      }
    }
  ],
  env: {
    browser: true,
    node: true,
    commonjs: true,
    es6: true
  }
};

