/* eslint-disable @typescript-eslint/no-require-imports */
const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/tests/setup/jest.setup.ts"],
  testMatch: [
    "<rootDir>/tests/**/*.test.ts",
    "<rootDir>/tests/**/*.test.tsx",
    "<rootDir>/tests/**/*.spec.ts",
    "<rootDir>/tests/**/*.spec.tsx",
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(msw|@mswjs|@open-draft|rettime)/)",
  ],
  testPathIgnorePatterns: ["/node_modules/", "/tests/e2e/"],
  clearMocks: true,
};

module.exports = createJestConfig(customJestConfig);
