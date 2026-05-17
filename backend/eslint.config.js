import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";

/** @type {import('eslint').Linter.Config[]} */
export default [
  // 1. Global ignored files
  {
    ignores: ["**/node_modules/", "**/dist/", "**/build/"],
  },

  // 2. Base configuration for all JavaScript files (Backend)
  js.configs.recommended,
  {
    files: ["src/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs", // Tells ESLint you are using 'require'
      globals: {
        ...globals.node,
      },
    },
    rules: {
      "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
      "no-console": "off", // Usually off for backends to allow logging
    },
  },

  // 3. Configuration for TypeScript files (Frontend)
  ...tseslint.configs.recommended.map((config) => ({
    ...config,
    files: ["frontend/src/**/*.{ts,tsx}"], // Adjust path to your React folder
  })),

  // 4. React-specific configuration
  {
    files: ["frontend/src/**/*.{jsx,tsx}"],
    plugins: {
      react: pluginReact,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      ...pluginReact.configs.recommended.rules,
      "react/react-in-jsx-scope": "off", // Not needed for modern React
    },
  },
];