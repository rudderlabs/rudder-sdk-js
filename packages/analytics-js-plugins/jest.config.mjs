/* eslint-disable */
export default {
  displayName: '@rudderstack/analytics-js-plugins',
  preset: '../../jest.preset.js',
  rootDir: './',
  coveragePathIgnorePatterns: ['src/errorReporting/event'],
  coverageThreshold: {
    global: {
      branches: 79,
      functions: 86,
      lines: 87,
      statements: 86,
    },
  },
};
