module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
  ],
  overrides: [
    // {
    //     "env": {
    //         "node": true
    //     },
    //     "files": [
    //         ".eslintrc.{js,cjs}"
    //     ],
    //     "parserOptions": {
    //         "sourceType": "script"
    //     }
    // }
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  ignorePatterns: ["src/test/*", ".eslintrc.js"],
  plugins: ["@typescript-eslint", "react", "react-hooks"],
  rules: {
    "@typescript-eslint/no-shadow": ["off"],
    "no-shadow": "off",
    "no-undef": "off",
    "@typescript-eslint/no-unused-vars": ["warn", { "varsIgnorePattern": "React", "argsIgnorePattern": "^_" }],
    "no-console": ["warn", { allow: ["info", "warn", "error"] }],
    "no-plusplus": 0,
    "prefer-destructuring": ["warn", { object: true, array: false }],
    "no-underscore-dangle": 0,
    "@typescript-eslint/no-var-requires": 0,
    "react-hooks/exhaustive-deps": 0,
    "@typescript-eslint/ban-ts-comment": [
      1,
      { "ts-ignore": false, "ts-nocheck": false },
    ],
    "@typescript-eslint/no-use-before-define": 0,
    "@typescript-eslint/explicit-module-boundary-types": 0,
    "@typescript-eslint/no-explicit-any": 0,
    radix: 0,
    "react/jsx-no-bind": 0,
    "import/no-extraneous-dependencies": 0,
    "jsx-a11y/media-has-caption": 0,
  },
};
