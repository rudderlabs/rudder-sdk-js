/* eslint-disable */
export default {
  displayName: '@rudderstack/analytics-js-plugins',
  preset: '../../jest.preset.js',
  rootDir: './',
  coveragePathIgnorePatterns: ['src/errorReporting/event'],
  // Enforced in CI only, so focused local runs (`npm run test -- <path>`) do not fail the package-wide minimum.
  coverageThreshold:
    process.env.CI === 'true'
      ? {
          global: {
            branches: 79,
            functions: 86,
            lines: 87,
            statements: 86,
          },
        }
      : undefined,
};
