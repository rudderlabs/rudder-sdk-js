/* eslint-disable */
export default {
  displayName: '@rudderstack/analytics-js-common',
  preset: '../../jest.preset.js',
  rootDir: './',
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
  coveragePathIgnorePatterns: ['<rootDir>/src/constants/integrations'],
};
