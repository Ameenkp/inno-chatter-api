import config from "./jest.config";

module.exports = {
    ...config,
    testMatch: ["<rootDir>/__tests__/integration/**/*.it.ts"], // Specify the test match pattern for integration tests
};