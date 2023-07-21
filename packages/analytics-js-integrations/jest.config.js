const sharedConfig = require('../../jest.config.js');

module.exports = {
  ...sharedConfig,
  coverageDirectory: 'packages/analytics-js-integrations/reports/coverage',
  rootDir: './../../',
  roots: ['<rootDir>'],
  testMatch: ['<rootDir>/packages/analytics-js-integrations/__tests__/**/*.(j|t)s?(x)'],
  collectCoverageFrom: [
    '<rootDir>/packages/analytics-js-integrations/src/**/*.(j|t)s?(x)',
    '!<rootDir>/node_modules/**/*',
    '!<rootDir>/**/dist/**/*',
    '!<rootDir>/**/jest.*',
    '!<rootDir>/**/types.ts',
    '!<rootDir>/**/*.d.*',
    '!<rootDir>/**/__mocks__/**/*',
    '!<rootDir>/**/__fixtures__/**/*',
  ],
};
