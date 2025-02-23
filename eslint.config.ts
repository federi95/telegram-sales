import path from "node:path";
import { fileURLToPath } from "node:url";

import { includeIgnoreFile } from "@eslint/compat";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import oxlint from "eslint-plugin-oxlint";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import eslintPluginUnicorn from "eslint-plugin-unicorn";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

const gitignorePath = path.resolve(__dirname, ".gitignore");

/** @type {import('eslint').Linter.Config[]} */
const config = [
  ...compat.extends("next/core-web-vitals"),
  ...compat.extends("next/typescript"),
  ...compat.extends("plugin:@tanstack/eslint-plugin-query/recommended"),
  ...compat.extends("prettier"),
  ...compat.plugins("@tanstack/query"),
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
  },
  eslintPluginUnicorn.configs.recommended,
  oxlint.configs["flat/recommended"],
  includeIgnoreFile(gitignorePath),
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.mdx"],
    ignores: ["**/*.js", "**/*.mjs", "**/*.cjs", "node_modules", ".next", "dist", "**/*.json"],
    rules: {
      "react/display-name": "off",
      "import/no-anonymous-default-export": "off",
      "unicorn/no-anonymous-default-export": "off",
      "unicorn/no-null": "off",
      "unicorn/no-array-reduce": "off",
      "unicorn/prevent-abbreviations": "off",
    },
  },
];

export default config;
