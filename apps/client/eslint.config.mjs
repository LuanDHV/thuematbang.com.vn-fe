import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const testGlobals = {
  afterAll: "readonly",
  afterEach: "readonly",
  beforeAll: "readonly",
  beforeEach: "readonly",
  describe: "readonly",
  expect: "readonly",
  it: "readonly",
  jest: "readonly",
  test: "readonly",
};

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: [
      "tests/**/*.{ts,tsx}",
      "tests/**/*.js",
      "tests/**/*.cjs",
      "tests/**/*.cts",
      "scripts/**/*.cjs",
      "scripts/**/*.cts",
      "**/*.test.{ts,tsx}",
      "**/*.spec.{ts,tsx}",
    ],
    languageOptions: {
      globals: {
        ...testGlobals,
      },
    },
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "coverage/**",
    "test-results/**",
    "playwright-report/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
