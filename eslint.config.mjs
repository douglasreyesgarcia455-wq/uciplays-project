import js from "@eslint/js";
import globals from "globals";

export default [
    js.configs.recommended,
    {
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "commonjs",
            globals: {
                ...globals.node,
                ...globals.browser
            }
        },
        rules: {
            "complexity": ["error", 10],
            "no-unused-vars": "warn",
            "no-console": "off",
            "no-undef": "error"
        }
    }
];