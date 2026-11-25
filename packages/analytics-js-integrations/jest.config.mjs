/* eslint-disable */
export default {
  displayName: '@rudderstack/analytics-js-integrations',
  preset: '../../jest.preset.js',
  rootDir: './',
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/__tests__/',
    '/__fixtures__/',
    '/__mocks__/',
    '.test.js',
    'nativeSdkLoader.js',
    '/integrations/.*/index.js',
  ],
  // Enforced in CI only, so focused local runs (`npm run test -- <path>`) do not fail the package-wide minimum.
  coverageThreshold:
    process.env.CI === 'true'
      ? {
          global: {
            branches: 51,
            functions: 57,
            lines: 63,
            statements: 64,
          },
        }
      : undefined,
};
