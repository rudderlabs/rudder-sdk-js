/* eslint-disable */
export default {
  displayName: '@rudderstack/analytics-js-cookies',
  preset: '../../jest.preset.js',
  rootDir: './',
  // Enforced in CI only, so focused local runs (`npm run test -- <path>`) do not fail the package-wide minimum.
  coverageThreshold:
    process.env.CI === 'true'
      ? {
          global: {
            branches: 91,
            functions: 75,
            lines: 92,
            statements: 92,
          },
        }
      : undefined,
};
