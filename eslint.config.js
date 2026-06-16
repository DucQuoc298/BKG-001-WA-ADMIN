
import globals from "globals";
import { fixupPluginRules } from "@eslint/compat";
import path from "path";
import { fileURLToPath } from "url";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default [
  {
    ignores: ["src/test/*", "**/._*", ".eslintrc.js", "eslint.config.js"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: "latest",
        sourceType: "module",
        project: ["./tsconfig.json"],
        tsconfigRootDir: __dirname,
      },
    },
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      react,
      "react-hooks": reactHooks,
      "@typescript-eslint": tseslint.plugin,
      "jsx-a11y": jsxA11y,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
      "@typescript-eslint/no-shadow": ["off"],
      "no-shadow": "off",
      "no-undef": "off",
      "@typescript-eslint/no-non-null-assertion": ["off"],
      "@typescript-eslint/no-unused-expressions": ["off"],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { varsIgnorePattern: "React", argsIgnorePattern: "^_" },
      ],
      "no-console": ["off", { allow: ["info", "warn", "error"] }],
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
      "react/react-in-jsx-scope": "off"
    },
  },
];
