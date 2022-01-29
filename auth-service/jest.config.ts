export default {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: [
    "./node_modules/",
    "./db/",
    "./src/errors/",
    "./src/enitity/",
    "./src/scripts/",
    "./src/utils/DBConnectionManager.ts"
  ],
  coverageProvider: "v8",
  coverageReporters: ["json"],
  coverageThreshold: undefined,
  preset: "ts-jest",
  rootDir: undefined,
  testMatch: ["**/__tests__/**/*.ts?(x)", "**/?(*.)+(spec|test).ts?(x)"],
  testPathIgnorePatterns: ["/node_modules/", "/db/", "/dist/"]
};
