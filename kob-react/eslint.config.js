import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";

export default [
  {
    ignores: ["dist/**", "node_modules/**", "*.config.js", "*.cjs"],
  },
  pluginJs.configs.recommended,
  {
    files: ["src/**/*.{js,jsx}"],
    plugins: {
      react: pluginReact,
      "react-hooks": pluginReactHooks,
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
    settings: { react: { version: "18.2" } },
    rules: {
      ...pluginReact.configs.recommended.rules,
      ...pluginReactHooks.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react/no-unescaped-entities": "off",
    },
  },
  {
    files: ["api/**/*.js"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  {
    files: ["src/firebase-messaging-sw.js"],
    languageOptions: {
      globals: {
        ...globals.serviceworker,
        firebase: "readonly",
        __FIREBASE_API_KEY__: "readonly",
        __FIREBASE_AUTH_DOMAIN__: "readonly",
        __FIREBASE_PROJECT_ID__: "readonly",
        __FIREBASE_STORAGE_BUCKET__: "readonly",
        __FIREBASE_MESSAGING_SENDER_ID__: "readonly",
        __FIREBASE_APP_ID__: "readonly",
      },
    },
  },
];
