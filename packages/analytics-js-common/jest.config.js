const sharedConfig = require('../../jest.config.js');

module.exports = {
  ...sharedConfig,
  coverageDirectory: 'packages/analytics-js-common/reports/coverage',
  coverageReporters: [
    ['lcov', { projectRoot: '/packages/analytics-js-common/' }],
    'text',
    'text-summary',
    'clover',
  ],
  rootDir: './../../',
  roots: ['<rootDir>'],
  testMatch: ['<rootDir>/packages/analytics-js-common/__tests__/**/*.(j|t)s?(x)'],
  collectCoverageFrom: [
    '<rootDir>/packages/analytics-js-common/src/**/*.(j|t)s?(x)',
    '!<rootDir>/node_modules/**/*',
    '!<rootDir>/**/dist/**/*',
    '!<rootDir>/**/jest.*',
    '!<rootDir>/**/types.ts',
    '!<rootDir>/**/*.d.*',
    '!<rootDir>/**/__mocks__/**/*',
    '!<rootDir>/**/__fixtures__/**/*',
  ],
};
