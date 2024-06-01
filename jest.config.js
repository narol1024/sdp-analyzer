import 'dotenv/config';

const isCI = process.env.CI === 'true';

export default {
  verbose: true,
  collectCoverage: false,
  resetModules: true,
  restoreMocks: true,
  testEnvironment: 'node',
  transform: {},
  preset: 'ts-jest/presets/default-esm',
  extensionsToTreatAsEsm: ['.ts'],
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
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
