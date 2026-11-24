/* eslint-disable */
export default {
  displayName: '@rudderstack/analytics-js-legacy-utilities',
  preset: '../../jest.preset.js',
  rootDir: './',
  // Enforced in CI only, so focused local runs (`npm run test -- <path>`) do not fail the package-wide minimum.
  coverageThreshold:
    process.env.CI === 'true'
      ? {
          global: {
            branches: 21,
            functions: 3,
            lines: 25,
            statements: 24,
          },
        }
      : undefined,
};
