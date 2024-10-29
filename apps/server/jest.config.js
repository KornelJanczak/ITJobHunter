/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  globalSetup: "./setup.js",
  globalTeardown: "./teardown.js",
  testEnvironment: "./puppeteer_environment.js",
};
