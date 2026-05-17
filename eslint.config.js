import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";

export default tseslint.config(
    js.configs.recommended,
    ...tseslint.configs.recommended,
    pluginReact.configs.flat.recommended,
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                ...globals.browser,
                ...globals.node, // 🛡️ This tells ESLint that 'process' is okay!
            },
        },
        settings: {
            react: {
                version: "detect", // Automatically detects your React version
            },
        },
        rules: {
            // Allows you to use 'require' while you migrate, or just 'import'
            "@typescript-eslint/no-require-imports": "off",
            "no-undef": "error",
        },
    },
);