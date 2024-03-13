/* eslint-disable */
export default {
  displayName: '@rudderstack/analytics-js-integrations',
  preset: '../../jest.preset.js',
  rootDir: './',
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/__tests__/",
    "/__fixtures__/",
    "/__mocks__/",
    ".test.js",
    "nativeSdkLoader.js",
    "/integrations/.*/index.js"
  ],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
};
