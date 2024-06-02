require('dotenv/config');

const isCI = process.env.CI === 'true';

module.exports = {
  verbose: true,
  collectCoverage: false,
  resetModules: true,
  restoreMocks: true,
  testEnvironment: 'node',
  transform: {
    '^.+\\\\\\\\.tsx?$': 'ts-jest',
  },
  preset: 'ts-jest/presets/default-esm',
  extensionsToTreatAsEsm: ['.ts'],
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
  // testMatch: ['<rootDir>/src/cli/*.spec.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.test.json',
      useESM: true,
    },
    __JEST_TEST_ENV__: true,
  },
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coveragePathIgnorePatterns: [
    '<rootDir>/dist/',
    '/node_modules/',
    '<rootDir>/scripts',
    '<rootDir>/tools',
    '<rootDir>/src/types.ts',
    '<rootDir>/src/globals.d.ts',
  ],
  coverageProvider: 'v8',
  coverageReporters: isCI ? ['json'] : ['text'],
  testTimeout: 120 * 1000,
};
