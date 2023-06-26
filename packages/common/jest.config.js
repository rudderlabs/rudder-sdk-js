const sharedConfig = require('../../jest.config.js');

module.exports = {
  ...sharedConfig,
  coverageDirectory: 'packages/common/reports/coverage',
  coverageReporters: [
    ['lcov', { projectRoot: '/packages/common/' }],
    'text',
    'text-summary',
    'clover',
  ],
  rootDir: './../../',
  roots: ['<rootDir>'],
  testMatch: ['<rootDir>/packages/common/__tests__/**/*.(j|t)s?(x)'],
  collectCoverageFrom: [
    '<rootDir>/packages/common/src/**/*.(j|t)s?(x)',
    '!<rootDir>/node_modules/**/*',
    '!<rootDir>/**/dist/**/*',
    '!<rootDir>/**/jest.*',
    '!<rootDir>/**/types.ts',
    '!<rootDir>/**/*.d.*',
    '!<rootDir>/**/__mocks__/**/*',
    '!<rootDir>/**/__fixtures__/**/*',
  ],
};
