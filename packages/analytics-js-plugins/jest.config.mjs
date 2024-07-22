/* eslint-disable */
export default {
  displayName: '@rudderstack/analytics-js-plugins',
  preset: '../../jest.preset.js',
  rootDir: './',
  coveragePathIgnorePatterns: ['src/errorReporting/event'],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
};
