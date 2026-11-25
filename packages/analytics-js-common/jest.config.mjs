/* eslint-disable */
export default {
  displayName: '@rudderstack/analytics-js-common',
  preset: '../../jest.preset.js',
  rootDir: './',
  // Enforced in CI only, so focused local runs (`npm run test -- <path>`) do not fail the package-wide minimum.
  coverageThreshold:
    process.env.CI === 'true'
      ? {
          global: {
            branches: 87,
            functions: 91,
            lines: 91,
            statements: 91,
          },
        }
      : undefined,
};
