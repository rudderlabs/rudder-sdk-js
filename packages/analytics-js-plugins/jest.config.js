const sharedConfig = require('../../jest.config.js');

module.exports = {
  ...sharedConfig,
  coverageDirectory: 'packages/analytics-js-plugins/reports/coverage',
  coverageReporters: [
    ['lcov', { projectRoot: '/packages/analytics-js-plugins/' }],
    'text',
    'text-summary',
    'clover',
  ],
  rootDir: './../../',
  roots: ['<rootDir>'],
  testMatch: ['<rootDir>/packages/analytics-js-plugins/__tests__/**/*.(j|t)s?(x)'],
  collectCoverageFrom: [
    '<rootDir>/packages/analytics-js-plugins/src/**/*.(j|t)s?(x)',
    '!<rootDir>/node_modules/**/*',
    '!<rootDir>/**/dist/**/*',
    '!<rootDir>/**/jest.*',
    '!<rootDir>/**/types.ts',
    '!<rootDir>/**/*.d.*',
    '!<rootDir>/**/__mocks__/**/*',
    '!<rootDir>/**/__fixtures__/**/*',
  ],
};
