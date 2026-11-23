/* eslint-disable */
export default {
  displayName: 'rudder-sdk-js',
  preset: '../../jest.preset.js',
  rootDir: './',
  coverageThreshold: {
    global: {
      branches: 16,
      functions: 27,
      lines: 30,
      statements: 30,
    },
  },
};
