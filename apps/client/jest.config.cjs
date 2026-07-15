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
    "^(\\.{1,2}/.*)\\.js$": "$1",
    "^@thuematbang/contracts$": "<rootDir>/../../packages/contracts/src/index.ts",
    "^@thuematbang/contracts/(.*)$":
      "<rootDir>/../../packages/contracts/src/$1/index.ts",
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(msw|@mswjs|@open-draft|rettime)/)",
  ],
  testPathIgnorePatterns: ["/node_modules/", "/tests/e2e/"],
  clearMocks: true,
};

module.exports = createJestConfig(customJestConfig);
