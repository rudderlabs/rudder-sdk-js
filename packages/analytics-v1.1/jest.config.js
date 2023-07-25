const sharedConfig = require('../../jest.config.js');

module.exports = {
  ...sharedConfig,
  coverageDirectory: 'packages/analytics-v1.1/reports/coverage',
  rootDir: './../../',
  roots: ['<rootDir>'],
  testMatch: [
    '<rootDir>/packages/analytics-v1.1/__tests__/**/*.(j|t)s?(x)',
    '<rootDir>/packages/analytics-v1.1/src/**/*.?(spec|test).(j|t)s?(x)',
  ],
  collectCoverageFrom: [
    '<rootDir>/packages/analytics-v1.1/src/**/*.(j|t)s?(x)',
    '!<rootDir>/node_modules/**/*',
    '!<rootDir>/**/dist/**/*',
    '!<rootDir>/**/jest.*',
    '!<rootDir>/**/types.ts',
    '!<rootDir>/**/*.d.*',
    '!<rootDir>/**/__mocks__/**/*',
    '!<rootDir>/**/__fixtures__/**/*',
  ],
};
