import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import prettierPlugin from "eslint-plugin-prettier";
import globals from "globals";

export default [
  // Base JS recommendations
  js.configs.recommended,

  // TypeScript files
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      // Hardhat / ethers reality
      "@typescript-eslint/no-explicit-any": "off",

      // Clean unused vars, allow _-prefixed
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],

      // Prettier is the formatting authority
      "prettier/prettier": "error",
    },
  },

  // Mocha globals — TEST FILES ONLY
  {
    files: ["test/**/*.ts"],
    languageOptions: {
      globals: globals.mocha,
    },
  },

  // Ignore generated / irrelevant paths
  {
    ignores: [
      "node_modules/**",
      "artifacts/**",
      "cache/**",
      "coverage/**",
      "dist/**",
      "build/**",
      "types/**",
    ],
  },
];
